#!/usr/bin/env python3

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from bs4 import BeautifulSoup
from wp_stage_client import WordPressStageClient


STYLE_END = "</style>"
WRAPPER_OPEN = '<div class="ewc-home-v2" id="top">'
SCRIPT_START = "<script>"

SEGMENT_MARKERS = {
    "topbar": (
        '<section class="ewc-shell-nav ewc-topbar">',
        '<section class="ewc-shell ewc-hero">',
    ),
    "hero": (
        '<section class="ewc-shell ewc-hero">',
        '<section class="ewc-shell ewc-section" id="proof">',
    ),
    "proof": (
        '<section class="ewc-shell ewc-section" id="proof">',
        '<section class="ewc-shell ewc-section" id="inside">',
    ),
    "inside": (
        '<section class="ewc-shell ewc-section" id="inside">',
        '<section class="ewc-shell ewc-section" id="process">',
    ),
    "process": (
        '<section class="ewc-shell ewc-section" id="process">',
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-credibility">',
    ),
    "credibility": (
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-credibility">',
        '<section class="ewc-shell ewc-section" id="case-studies">',
    ),
    "case_studies": (
        '<section class="ewc-shell ewc-section" id="case-studies">',
        '<section class="ewc-shell ewc-section" id="pricing">',
    ),
    "pricing": (
        '<section class="ewc-shell ewc-section" id="pricing">',
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-integrations-surface">',
    ),
    "integrations": (
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-integrations-surface">',
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-section-head">\n      <h2>Member Testimonials.</h2>',
    ),
    "testimonials": (
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-section-head">\n      <h2>Member Testimonials.</h2>',
        '<section class="ewc-shell ewc-section" id="faq">',
    ),
    "faq": (
        '<section class="ewc-shell ewc-section" id="faq">',
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-disclaimer">',
    ),
    "final_cta": (
        '<section class="ewc-shell ewc-section">\n    <div class="ewc-disclaimer">',
        '<section class="ewc-shell ewc-site-footer-wrap">',
    ),
    "footer": (
        '<section class="ewc-shell ewc-site-footer-wrap">',
        "\n</div>\n\n<script>",
    ),
}


def normalize_domains(html: str) -> str:
    html = (
        html.replace("http://test.elliottwaveclub.com", "https://elliottwaveclub.com")
        .replace("https://test.elliottwaveclub.com", "https://elliottwaveclub.com")
    )
    asset_map = {
        "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-scaled.png": "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-scaled-1.png",
        "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-52-scaled.png": "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-52-scaled-1.png",
        "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-53-scaled.png": "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-53-scaled-1.png",
        "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-54-scaled.png": "https://elliottwaveclub.com/wp-content/uploads/2026/03/Ads-Q1-2026-54-scaled-1.png",
    }
    for source, target in asset_map.items():
        html = html.replace(source, target)
    return html.replace(
        "  body.page-id-1968 footer.site-footer {\n",
        "  body.page-id-1968 footer.site-footer,\n"
        "  body.page-id-1968 header.elementor-location-header,\n"
        "  body.page-id-1968 footer.elementor-location-footer {\n",
    )


def extract_between(source: str, start: str, end: str) -> str:
    start_index = source.index(start)
    end_index = source.index(end, start_index)
    return source[start_index:end_index].rstrip()


def build_partial_homepage(staged_html: str, segments: list[str]) -> str:
    staged_html = normalize_domains(staged_html)
    style = staged_html[: staged_html.index(STYLE_END) + len(STYLE_END)].rstrip()
    script = staged_html[staged_html.index(SCRIPT_START) :].strip()
    body_parts = []

    for segment in segments:
        start, end = SEGMENT_MARKERS[segment]
        body_parts.append(extract_between(staged_html, start, end))

    return "\n\n".join(
        [
            style,
            WRAPPER_OPEN,
            "\n\n".join(body_parts),
            "</div>",
            script,
        ]
    )


def build_html_widget_section(html: str) -> dict:
    return {
        "id": "ewclive01",
        "elType": "section",
        "isInner": False,
        "settings": {},
        "elements": [
            {
                "id": "ewclive02",
                "elType": "column",
                "isInner": False,
                "settings": {"_column_size": 100},
                "elements": [
                    {
                        "id": "ewclive03",
                        "elType": "widget",
                        "widgetType": "html",
                        "settings": {"html": html},
                        "elements": [],
                    }
                ],
            }
        ],
    }


def load_live_sections(backup_path: Path) -> list[dict]:
    payload = json.loads(backup_path.read_text(encoding="utf-8"))
    elementor_data = payload["meta"]["_elementor_data"]
    return json.loads(elementor_data) if isinstance(elementor_data, str) else elementor_data


def load_live_rendered_sections(backup_path: Path) -> list[str]:
    payload = json.loads(backup_path.read_text(encoding="utf-8"))
    soup = BeautifulSoup(payload["content"]["rendered"], "html.parser")
    return [str(section) for section in soup.select("section[data-id]")]


def update_homepage(
    base_url: str,
    username: str,
    password: str,
    staged_html_path: Path,
    backup_json_path: Path,
    page_id: int,
    segments: list[str],
    live_start_index: int,
) -> dict:
    partial_html = build_partial_homepage(
        staged_html_path.read_text(encoding="utf-8"),
        segments,
    )
    live_rendered_sections = load_live_rendered_sections(backup_json_path)
    combined_html = "\n\n".join([partial_html] + live_rendered_sections[live_start_index:])
    elementor_data = [build_html_widget_section(combined_html)]
    meta = {
        "_elementor_edit_mode": "builder",
        "_elementor_template_type": "wp-page",
        "_elementor_data": json.dumps(elementor_data, separators=(",", ":")),
        "_elementor_page_settings": None,
        "_elementor_conditions": [],
    }

    client = WordPressStageClient(base_url, username, password)
    return client.rest(
        f"/wp-json/wp/v2/pages/{page_id}",
        method="POST",
        payload={"content": combined_html, "meta": meta},
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Stage partial homepage sections onto live.")
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--username", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--page-id", type=int, default=1968)
    parser.add_argument("--staged-html", type=Path, required=True)
    parser.add_argument("--backup-json", type=Path, required=True)
    parser.add_argument("--segments", required=True, help="Comma-separated staged section names.")
    parser.add_argument("--live-start-index", type=int, required=True)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    segments = [segment.strip() for segment in args.segments.split(",") if segment.strip()]
    result = update_homepage(
        base_url=args.base_url,
        username=args.username,
        password=args.password,
        staged_html_path=args.staged_html,
        backup_json_path=args.backup_json,
        page_id=args.page_id,
        segments=segments,
        live_start_index=args.live_start_index,
    )
    print(
        json.dumps(
            {
                "id": result["id"],
                "modified": result["modified"],
                "segments": segments,
                "live_start_index": args.live_start_index,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
