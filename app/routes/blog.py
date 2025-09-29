from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from bs4 import BeautifulSoup
import asyncio
import glob
from app.utils import read_file, parse_markdown_file, generate_blog_html

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
                <button id="copyLinkBtn" class="copy-link-btn" onclick="copyPostLink('{post["slug"]}')">
                    Copy Link
                </button>
                <h1>{post["title"]}</h1>
                <p class="post-date">{post["date"]}</p>
            </div>
            <div class="post-content">{post["content"]}</div>
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
                f"https://mlship.dev/assets/opengraph/images/{slug}.png"
            )
            soup.find("meta", property="og:url")["content"] = (
                f"https://mlship.dev/blog/{slug}"
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
    """Serve the pregenerated atom.xml file"""
    try:
        return FileResponse(
            "atom.xml",
            media_type="application/atom+xml",
            headers={"Cache-Control": "public, max-age=3600"},  # Cache for 1 hour
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Atom feed not found")


@router.get("/rss.xml")
async def serve_rss_feed():
    """Serve the pregenerated rss.xml file"""
    try:
        return FileResponse(
            "rss.xml",
            media_type="application/rss+xml",
            headers={"Cache-Control": "public, max-age=3600"},  # Cache for 1 hour
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="RSS feed not found")


@router.get("/feed")
@router.get("/feed.xml")
async def serve_default_feed():
    """Redirect common feed URLs to RSS feed"""
    try:
        return FileResponse(
            "rss.xml",
            media_type="application/rss+xml",
            headers={"Cache-Control": "public, max-age=3600"},
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Feed not found")
