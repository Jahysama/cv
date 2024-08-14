
---

title: "How I built my website with Claude"
date: "2024-08-13"
slug: "my-website"
excerpt: "This is my experience building a website with Claude AI"
---

# Building My Personal Website with Claude AI, FastAPI, and HTMX

As a developer, having a personal website is a great way to showcase your skills and share your thoughts with the world. In this post, I'll walk you through how I built my personal website using Claude AI for guidance, FastAPI as the backend framework, and HTMX for dynamic frontend interactions.

## The Stack

- **Backend**: FastAPI
- **Frontend**: HTML, CSS, and HTMX
- **AI Assistant**: Claude AI

## Getting Started

The first step was to plan out the structure of my website. I wanted a clean, minimalist design with a touch of personality. The main components I decided on were:

1. Home page
2. About page
3. Projects page
4. Contact page
5. Blog

## Setting Up the Backend

I chose FastAPI for the backend because of its speed, simplicity, and built-in support for asynchronous programming. Here's a look at my `main.py` file:

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import blog, pages, search
from app.config import setup_logging

app = FastAPI()

# Set up logging
setup_logging()

# Include routers
app.include_router(blog.router)
app.include_router(pages.router)
app.include_router(search.router)

# Serve static files
app.mount("/", StaticFiles(directory="."), name="static")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
```

This setup allows me to organize my routes into separate modules (`blog`, `pages`, and `search`), making the codebase more maintainable as it grows.

## Designing the Frontend

For the frontend, I went with a minimalist design using HTML and CSS. I used HTMX to add dynamic interactions without the need for complex JavaScript. Here's a snippet from my `index.html`:

```html
<div>
    <div id="ascii-mountains">
        <!-- ASCII art mountains -->
    </div>
    <h1>Egor Kosaretsky</h1>
</div>

<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/projects">Projects</a>
    <a href="/contact">Contact</a>
    <a href="/blog">Blog</a>
</nav>

<div class="social-links">
    <!-- Social media links -->
</div>
```

I also added a fun ASCII art of mountains to give the site some personality.

## Styling with CSS

To keep my CSS organized, I split it into multiple files and imported them into a main CSS file:

```css
@import url('base.css');
@import url('layout.css');
@import url('components.css');
@import url('terminal.css');
@import url('blog.css');
@import url('responsive.css');
```

This approach allows me to easily manage different aspects of my site's styling.

## Adding Interactivity with HTMX

HTMX allowed me to add dynamic content loading without writing complex JavaScript. For example, I used it to implement a live search feature and to load blog posts dynamically.

## Leveraging Claude AI

Throughout the development process, I used Claude AI to help with various aspects:

1. **Code Generation**: Claude helped me write boilerplate code and suggest improvements.
2. **Problem Solving**: When I encountered bugs or needed to implement a tricky feature, Claude provided guidance and solutions.
3. **Design Ideas**: Claude offered suggestions for layout and design elements, like the ASCII art mountains.
4. **Content Creation**: Claude assisted in writing copy for the website and even helped draft this blog post!

## Challenges and Learnings

Building this website wasn't without its challenges. Some of the key learnings were:

1. **FastAPI Configuration**: Setting up FastAPI to serve static files alongside dynamic routes took some trial and error.
2. **HTMX Integration**: Learning how to effectively use HTMX for dynamic content loading was a new experience, but it paid off in simplified frontend code.
3. **Responsive Design**: Ensuring the site looked good on all device sizes required careful CSS planning.

## Conclusion

Building my personal website with the help of Claude AI, FastAPI, and HTMX was an exciting and educational experience. The combination of a powerful AI assistant, a fast and intuitive backend framework, and a simple yet effective frontend technology stack allowed me to create a website that's both functional and reflective of my personality as a developer.

I'm looking forward to continually improving and expanding my site. If you're thinking about building your own personal website, I highly recommend giving this stack a try!

---

Feel free to check out my website at [Your Website URL] and the source code at [Your GitHub Repository URL].

Happy coding!
