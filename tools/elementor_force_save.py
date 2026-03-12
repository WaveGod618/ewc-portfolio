#!/usr/bin/env python3

import argparse

from playwright.sync_api import sync_playwright


def force_save(base_url: str, username: str, password: str, post_id: int) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1024})
        page.goto(f"{base_url.rstrip('/')}/wp-login.php", wait_until="domcontentloaded", timeout=120000)
        page.fill("#user_login", username)
        page.fill("#user_pass", password)
        page.click("#wp-submit")
        page.wait_for_load_state("networkidle", timeout=120000)
        page.goto(
            f"{base_url.rstrip('/')}/wp-admin/post.php?post={post_id}&action=elementor",
            wait_until="domcontentloaded",
            timeout=120000,
        )
        page.wait_for_timeout(12000)
        page.wait_for_function(
            "() => !!(window.elementor && window.elementor.documents && window.elementor.documents.currentDocument && window.elementor.documents.currentDocument.container && window.elementor.documents.currentDocument.container.children && window.elementor.documents.currentDocument.container.children.length)",
            timeout=120000,
        )
        page.evaluate(
            """
            () => {
              const widget = window.elementor.documents.currentDocument.container.children[0].children[0].children[0];
              const current = widget.settings.get('html');
              widget.settings.set('html', current + ' ');
              const button = document.querySelector('#elementor-panel-saver-button-publish');
              if (button) {
                button.classList.remove('elementor-disabled');
                button.removeAttribute('disabled');
                button.click();
              }
            }
            """
        )
        page.wait_for_timeout(12000)
        browser.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Force an Elementor editor save for a post.")
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--username", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--post-id", type=int, required=True)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    force_save(args.base_url, args.username, args.password, args.post_id)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
