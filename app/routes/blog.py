import asyncio
import glob
import xml.etree.ElementTree as ET
from datetime import datetime

from app.utils import generate_blog_html, parse_markdown_file, read_file
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse

router = APIRouter()


async def get_blog_posts():
    blog_posts = []
    blog_post_files = glob.glob("blog_posts/*.md")
    for file_path in blog_post_files:
        try:
            post = await asyncio.to_thread(parse_markdown_file, file_path)
            blog_posts.append(post)
        except Exception as e:
            print(f"Error parsing blog post {file_path}: {str(e)}")
    return sorted(blog_posts, key=lambda x: x["date"], reverse=True)


@router.get("/blog/{slug}", response_class=HTMLResponse)
async def serve_blog_post(request: Request, slug: str):
    posts = await get_blog_posts()
    post = next((p for p in posts if p["slug"] == slug), None)
    if post:
        blog_post_content = f"""
        <article class="blog-post">
            <div class="post-header">
                <button id="copyLinkBtn" class="copy-link-btn" onclick="copyPostLink('{post['slug']}')">
                    Copy Link
                </button>
                <h1>{post['title']}</h1>
                <p class="post-date">{post['date']}</p>
            </div>
            <div class="post-content">{post['content']}</div>
        </article>
        <script>
        function copyPostLink(slug) {{
            var baseURL = window.location.origin;
            var postURL = baseURL + '/blog/' + slug;
            navigator.clipboard.writeText(postURL).then(function() {{
                var btn = document.getElementById('copyLinkBtn');
                btn.textContent = 'Copied!';
                setTimeout(function() {{
                    btn.textContent = 'Copy Link';
                }}, 2000);
            }}).catch(function(err) {{
                console.error('Failed to copy: ', err);
            }});
        }}
        </script>
        """

        if request.headers.get("HX-Request"):
            return HTMLResponse(content=blog_post_content)
        else:
            with open("index.html", "r") as file:
                template = file.read()
            soup = BeautifulSoup(template, "html.parser")

            # Update OG meta tags
            soup.find("meta", property="og:title")["content"] = post["title"]
            soup.find("meta", property="og:description")["content"] = post.get(
                "excerpt", ""
            )
            soup.find("meta", property="og:image")["content"] = (
                f"https://kosaretsky.co.uk/assets/opengraph/images/{slug}.png"
            )
            soup.find("meta", property="og:url")["content"] = (
                f"https://kosaretsky.co.uk/blog/{slug}"
            )
            soup.find("meta", property="og:type")["content"] = "article"

            main_content = soup.find(id="main-content")
            if main_content:
                main_content.clear()
                main_content.append(BeautifulSoup(blog_post_content, "html.parser"))

            return HTMLResponse(content=str(soup))
    else:
        raise HTTPException(status_code=404, detail="Not Found")


@router.get("/api/blog-posts")
async def serve_blog_posts():
    posts = await get_blog_posts()
    return [{k: v for k, v in post.items() if k != "content"} for post in posts]


@router.get("/atom.xml")
async def serve_atom_feed():
    posts = await get_blog_posts()
    domain = "https://kosaretsky.co.uk"
    atom = ET.Element("feed", xmlns="http://www.w3.org/2005/Atom")

    # Add title
    ET.SubElement(atom, "title").text = "Egor's personal blog"

    # Add both required link elements
    ET.SubElement(atom, "link", href=domain, rel="alternate", type="text/html")
    ET.SubElement(
        atom, "link", href=f"{domain}/atom.xml", rel="self", type="application/atom+xml"
    )

    # Add updated timestamp
    ET.SubElement(atom, "updated").text = datetime.utcnow().isoformat("T") + "Z"

    # Add ID with trailing slash for canonical form
    ET.SubElement(atom, "id").text = f"{domain}/"

    # Add author
    author = ET.SubElement(atom, "author")
    ET.SubElement(author, "name").text = "Egor Kosaretsky"

    # Add entries
    for post in posts:
        entry = ET.SubElement(atom, "entry")
        ET.SubElement(entry, "title").text = post["title"]
        ET.SubElement(
            entry,
            "link",
            href=f"{domain}/blog/{post['slug']}",
            rel="alternate",
            type="text/html",
        )
        ET.SubElement(entry, "id").text = f"{domain}/blog/{post['slug']}"
        ET.SubElement(entry, "updated").text = (
            datetime.strptime(post["date"], "%Y-%m-%d").isoformat("T") + "Z"
        )
        ET.SubElement(entry, "summary").text = post.get("excerpt", "")
        content = ET.SubElement(entry, "content", type="html")
        content.text = post.get("content", "")

    atom_xml = ET.tostring(atom, encoding="unicode", method="xml")
    return HTMLResponse(
        content=f'<?xml version="1.0" encoding="UTF-8"?>\n{atom_xml}',
        media_type="application/atom+xml",
    )
