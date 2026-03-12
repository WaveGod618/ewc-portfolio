#!/usr/bin/env python3

import argparse
import http.cookiejar
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0.0.0 Safari/537.36"
)


class WordPressStageClient:
    def __init__(self, base_url: str, username: str, password: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.username = username
        self.password = password
        self.cookies = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.cookies)
        )
        self.nonce = None

    def _request(self, url: str, method: str = "GET", data=None, headers=None) -> str:
        request_headers = {"User-Agent": USER_AGENT}
        if headers:
            request_headers.update(headers)

        request = urllib.request.Request(
            url,
            data=data,
            headers=request_headers,
            method=method,
        )

        try:
            with self.opener.open(request, timeout=30) as response:
                return response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"{exc.code} {exc.reason}\n{body}") from exc

    def login(self) -> None:
        self._request(f"{self.base_url}/wp-login.php")
        payload = urllib.parse.urlencode(
            {
                "log": self.username,
                "pwd": self.password,
                "wp-submit": "Log In",
                "redirect_to": f"{self.base_url}/wp-admin/",
                "testcookie": "1",
            }
        ).encode("utf-8")

        response = self._request(
            f"{self.base_url}/wp-login.php",
            method="POST",
            data=payload,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": self.base_url,
                "Referer": f"{self.base_url}/wp-login.php",
            },
        )

        if "403 - Forbidden" in response or "Access to this page is forbidden." in response:
            raise RuntimeError("Login blocked by the staging site security layer.")

        admin_html = response
        if '"wp_nonce":"' not in admin_html:
            admin_html = self._request(
                f"{self.base_url}/wp-admin/",
                headers={"Referer": f"{self.base_url}/wp-login.php"},
            )

        match = re.search(r'"wp_nonce":"([a-f0-9]+)"', admin_html)
        if not match:
            raise RuntimeError("Could not extract a WordPress REST nonce after login.")

        self.nonce = match.group(1)

    def rest(self, path: str, method: str = "GET", payload=None):
        if not self.nonce:
            self.login()

        data = None
        headers = {
            "Accept": "application/json",
            "Origin": self.base_url,
            "Referer": f"{self.base_url}/wp-admin/",
            "X-WP-Nonce": self.nonce,
        }

        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"

        body = self._request(f"{self.base_url}{path}", method=method, data=data, headers=headers)
        return json.loads(body)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Read and update staging WordPress pages.")
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--username", required=True)
    parser.add_argument("--password", required=True)

    subparsers = parser.add_subparsers(dest="command", required=True)

    get_page = subparsers.add_parser("get-page")
    get_page.add_argument("page_id", type=int)

    list_pages = subparsers.add_parser("list-pages")
    list_pages.add_argument("--per-page", type=int, default=100)

    update_page = subparsers.add_parser("update-page")
    update_page.add_argument("page_id", type=int)
    update_page.add_argument("--html-file")
    update_page.add_argument("--title")
    update_page.add_argument("--template")
    update_page.add_argument("--meta-file")

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    client = WordPressStageClient(args.base_url, args.username, args.password)

    if args.command == "get-page":
        result = client.rest(f"/wp-json/wp/v2/pages/{args.page_id}?context=edit")
        print(json.dumps(result, indent=2))
        return 0

    if args.command == "list-pages":
        result = client.rest(
            f"/wp-json/wp/v2/pages?per_page={args.per_page}&context=edit"
            "&_fields=id,slug,link,title,status,modified"
        )
        print(json.dumps(result, indent=2))
        return 0

    if args.command == "update-page":
        payload = {}
        if args.html_file is not None:
            html = Path(args.html_file).read_text(encoding="utf-8")
            payload["content"] = html
        if args.title is not None:
            payload["title"] = args.title
        if args.template is not None:
            payload["template"] = args.template
        if args.meta_file is not None:
            payload["meta"] = json.loads(Path(args.meta_file).read_text(encoding="utf-8"))

        if not payload:
            raise RuntimeError("No update fields provided.")

        result = client.rest(
            f"/wp-json/wp/v2/pages/{args.page_id}",
            method="POST",
            payload=payload,
        )
        print(json.dumps({"id": result["id"], "modified": result["modified"]}, indent=2))
        return 0

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
