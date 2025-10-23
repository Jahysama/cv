#!/usr/bin/env python3
"""
Posts blog content to Telegram channel.
Reads from detect_posts_to_publish.py output and posts to Telegram.
"""

import os
import sys
import json
import requests
from typing import Dict, List


def format_telegram_message(post_info: Dict) -> str:
    """
    Format post information into a Telegram message.
    Telegram supports HTML and Markdown formatting.
    """
    title = post_info.get("title", "")
    abstract = post_info.get("abstract", "")
    url = post_info.get("url", "")

    # Using HTML formatting (Telegram supports both HTML and Markdown)
    message = f"""<b>{title}</b>

{abstract}

<a href="{url}">Read full article →</a>"""

    return message


def post_to_telegram(bot_token: str, channel_id: str, message: str) -> bool:
    """
    Post a message to Telegram channel using Bot API.

    Args:
        bot_token: Telegram bot token from @BotFather
        channel_id: Channel ID (e.g., @your_channel or -1001234567890)
        message: Message text to send

    Returns:
        True if successful, False otherwise
    """
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    payload = {
        "chat_id": channel_id,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,  # Show preview for the link
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()

        result = response.json()
        if result.get("ok"):
            print(f"✓ Successfully posted to Telegram")
            return True
        else:
            print(f"✗ Telegram API error: {result.get('description')}", file=sys.stderr)
            return False

    except requests.exceptions.RequestException as e:
        print(f"✗ Failed to post to Telegram: {e}", file=sys.stderr)
        return False


def main():
    """
    Main entry point. Reads posts from stdin (JSON) and posts to Telegram.
    """
    import argparse

    parser = argparse.ArgumentParser(
        description="Post blog content to Telegram channel"
    )
    parser.add_argument("--bot-token", required=True, help="Telegram bot token")
    parser.add_argument(
        "--channel-id",
        required=True,
        help="Telegram channel ID (e.g., @channel_name or -1001234567890)",
    )
    parser.add_argument(
        "--posts-json",
        help="JSON file with posts to publish (default: read from stdin)",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Print messages without actually posting"
    )

    args = parser.parse_args()

    # Read posts data
    if args.posts_json:
        with open(args.posts_json, "r") as f:
            posts = json.load(f)
    else:
        posts = json.load(sys.stdin)

    if not posts:
        print("No posts to publish")
        return 0

    # Track successful posts
    successful_posts = []

    # Post each article that needs Telegram posting
    for file_path, post_info in posts.items():
        platforms = post_info.get("platforms", [])

        if "telegram" not in platforms:
            print(f"○ Skipping {file_path} (Telegram not in platforms list)")
            continue

        print(f"\nProcessing: {file_path}")
        print(f"Title: {post_info.get('title')}")

        message = format_telegram_message(post_info)

        if args.dry_run:
            print("\n--- DRY RUN: Would post this message ---")
            print(message)
            print("--- END MESSAGE ---\n")
            successful_posts.append(file_path)
        else:
            success = post_to_telegram(args.bot_token, args.channel_id, message)

            if success:
                successful_posts.append(file_path)
            else:
                print(f"✗ Failed to post {file_path}", file=sys.stderr)

    # Output successful posts as JSON for the next step
    print(f"\n=== Posted {len(successful_posts)} article(s) to Telegram ===")

    # Return JSON array of successfully posted files
    output = {"successful_posts": successful_posts, "platform": "telegram"}

    # Write to file for GitHub Actions to pick up
    with open("telegram_results.json", "w") as f:
        json.dump(output, f, indent=2)

    return 0 if successful_posts else 1


if __name__ == "__main__":
    sys.exit(main())
