document.addEventListener('DOMContentLoaded', (event) => {
  const path = window.location.pathname;
  const contentPath = path === '/' ? '/home' : path;
  htmx.ajax('GET', contentPath, '#main-content');
  hljs.highlightAll();
});

document.body.addEventListener('htmx:afterSwap', function (event) {
  console.log('htmx:afterSwap event triggered');
  hljs.highlightAll();

  if (event.detail.pathInfo.requestPath === '/home') {
    console.log('Fetching latest Mastodon post');
    fetchLatestPost();
  }
});


document.body.addEventListener('htmx:afterOnLoad', function (event) {
  var path = event.detail.pathInfo.requestPath;
  window.history.pushState({}, "", window.location.origin + path);
  document.title = path.substring(1).charAt(0).toUpperCase() + path.substring(2) || 'Home';
});

window.onpopstate = function (event) {
  var path = window.location.pathname;
  htmx.ajax('GET', path, '#main-content');
};
