document.addEventListener('DOMContentLoaded', (event) => {
    const path = window.location.pathname;
    const contentPath = path === '/' ? '/home' : path;
    htmx.ajax('GET', contentPath, '#main-content');
    hljs.highlightAll();
});

document.body.addEventListener('htmx:afterSwap', function(event) {
    console.log('htmx:afterSwap event triggered');
    hljs.highlightAll();

    if (event.detail.pathInfo.requestPath === '/home') {
        console.log('Fetching latest Mastodon post');
        fetchLatestPost();
    }
});

