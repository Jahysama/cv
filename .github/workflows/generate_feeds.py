import glob
import yaml
import markdown
import xml.etree.ElementTree as ET
from datetime import datetime
from html import escape


def parse_markdown_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
        _, frontmatter, markdown_content = content.split("---", 2)
        metadata = yaml.safe_load(frontmatter)
        html_content = markdown.markdown(markdown_content, extensions=["fenced_code"])
        return {**metadata, "content": html_content}


def generate_atom_feed():
    """Generate Atom 1.0 feed"""
    blog_posts = []
    blog_post_files = glob.glob("blog_posts/*.md")

    for file_path in blog_post_files:
        try:
            post = parse_markdown_file(file_path)
            blog_posts.append(post)
        except Exception as e:
            print(f"Error parsing blog post {file_path}: {str(e)}")

    # Sort posts by date, newest first
    posts = sorted(blog_posts, key=lambda x: x["date"], reverse=True)

    domain = "https://mlship.dev"

    # Create Atom feed with proper namespace
    atom = ET.Element("feed", xmlns="http://www.w3.org/2005/Atom")

    # Add required feed elements
    ET.SubElement(atom, "title").text = "Egor's personal blog"
    ET.SubElement(atom, "id").text = f"{domain}/"

    # Add both link types (alternate and self)
    ET.SubElement(atom, "link", href=domain, rel="alternate", type="text/html")
    # Self link should point to exactly where this feed is served
    ET.SubElement(
        atom, "link", href=f"{domain}/atom.xml", rel="self", type="application/atom+xml"
    )

    # Add updated timestamp (use most recent post date or current time)
    if posts:
        most_recent = datetime.strptime(posts[0]["date"], "%Y-%m-%d")
        # Use noon UTC for consistency
        updated_time = most_recent.strftime("%Y-%m-%dT12:00:00Z")
    else:
        # Use current date at noon UTC
        updated_time = datetime.utcnow().strftime("%Y-%m-%dT12:00:00Z")
    ET.SubElement(atom, "updated").text = updated_time

    # Add author
    author = ET.SubElement(atom, "author")
    ET.SubElement(author, "name").text = "Egor Kosaretsky"

    # Add subtitle (optional but recommended)
    ET.SubElement(atom, "subtitle").text = "Thoughts on software, technology, and life"

    # Add entries
    for post in posts:
        entry = ET.SubElement(atom, "entry")

        # Required entry elements
        ET.SubElement(entry, "title").text = post["title"]
        ET.SubElement(entry, "id").text = f"{domain}/blog/{post['slug']}"

        # Link to the post
        ET.SubElement(
            entry,
            "link",
            href=f"{domain}/blog/{post['slug']}",
            rel="alternate",
            type="text/html",
        )

        # Updated timestamp in proper ISO 8601 format (no microseconds)
        post_date = datetime.strptime(post["date"], "%Y-%m-%d")
        ET.SubElement(entry, "updated").text = post_date.strftime("%Y-%m-%dT12:00:00Z")
        ET.SubElement(entry, "published").text = post_date.strftime(
            "%Y-%m-%dT12:00:00Z"
        )

        # Author (can be per-entry or inherited from feed)
        entry_author = ET.SubElement(entry, "author")
        ET.SubElement(entry_author, "name").text = "Egor Kosaretsky"

        # Summary (plain text excerpt)
        if post.get("excerpt"):
            ET.SubElement(entry, "summary", type="text").text = post["excerpt"]

        # Content (HTML)
        content = ET.SubElement(entry, "content", type="html")
        content.text = post.get("content", "")

    # Convert to string with proper XML declaration
    atom_xml = ET.tostring(atom, encoding="unicode", method="xml")

    # Write to file
    with open("atom.xml", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(atom_xml)

    print(f"✓ Generated atom.xml with {len(posts)} blog posts")


def generate_rss_feed():
    """Generate RSS 2.0 feed"""
    blog_posts = []
    blog_post_files = glob.glob("blog_posts/*.md")

    for file_path in blog_post_files:
        try:
            post = parse_markdown_file(file_path)
            blog_posts.append(post)
        except Exception as e:
            print(f"Error parsing blog post {file_path}: {str(e)}")

    # Sort posts by date, newest first
    posts = sorted(blog_posts, key=lambda x: x["date"], reverse=True)

    domain = "https://mlship.dev"

    # Create RSS feed with proper namespace
    rss = ET.Element("rss", version="2.0")
    rss.set("xmlns:atom", "http://www.w3.org/2005/Atom")
    rss.set("xmlns:content", "http://purl.org/rss/1.0/modules/content/")

    channel = ET.SubElement(rss, "channel")

    # Required channel elements
    ET.SubElement(channel, "title").text = "Egor's personal blog"
    ET.SubElement(channel, "link").text = domain
    ET.SubElement(
        channel, "description"
    ).text = "Thoughts on software, technology, and life"

    # Add atom:link for feed autodiscovery
    ET.SubElement(
        channel,
        "{http://www.w3.org/2005/Atom}link",
        href=f"{domain}/rss.xml",
        rel="self",
        type="application/rss+xml",
    )

    # Optional but recommended channel elements
    ET.SubElement(channel, "language").text = "en-us"
    ET.SubElement(
        channel, "managingEditor"
    ).text = "egor@kosaretsky.co.uk (Egor Kosaretsky)"
    ET.SubElement(channel, "webMaster").text = "egor@kosaretsky.co.uk (Egor Kosaretsky)"

    # Add last build date
    if posts:
        most_recent = datetime.strptime(posts[0]["date"], "%Y-%m-%d")
        last_build = most_recent.strftime("%a, %d %b %Y %H:%M:%S +0000")
    else:
        last_build = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")
    ET.SubElement(channel, "lastBuildDate").text = last_build
    ET.SubElement(channel, "pubDate").text = last_build

    # Add items
    for post in posts:
        item = ET.SubElement(channel, "item")

        # Required item elements
        ET.SubElement(item, "title").text = post["title"]
        ET.SubElement(item, "link").text = f"{domain}/blog/{post['slug']}"
        ET.SubElement(
            item, "guid", isPermaLink="true"
        ).text = f"{domain}/blog/{post['slug']}"

        # Description (plain text or HTML)
        if post.get("excerpt"):
            ET.SubElement(item, "description").text = post["excerpt"]

        # Full content using content:encoded
        content_encoded = ET.SubElement(
            item, "{http://purl.org/rss/1.0/modules/content/}encoded"
        )
        content_encoded.text = post.get("content", "")

        # Publication date in RFC 822 format
        post_date = datetime.strptime(post["date"], "%Y-%m-%d")
        pub_date = post_date.strftime("%a, %d %b %Y %H:%M:%S +0000")
        ET.SubElement(item, "pubDate").text = pub_date

        # Author
        ET.SubElement(item, "author").text = "egor@kosaretsky.co.uk (Egor Kosaretsky)"

    # Convert to string with proper XML declaration
    rss_xml = ET.tostring(rss, encoding="unicode", method="xml")

    # Write to file
    with open("rss.xml", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(rss_xml)

    print(f"✓ Generated rss.xml with {len(posts)} blog posts")


if __name__ == "__main__":
    print("Generating feeds...")
    generate_atom_feed()
    generate_rss_feed()
    print("\nDone! Validate your feeds at:")
    print("  - https://validator.w3.org/feed/")
    print("  - https://www.feedvalidator.org/")
