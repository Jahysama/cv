function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

document.addEventListener('DOMContentLoaded', (event) => {
  const terminal = document.getElementById('terminal');

  if (isMobileDevice()) {
    // Remove the terminal for mobile devices
    if (terminal) {
      terminal.remove();
    }
    return; // Exit the function early for mobile devices
  }
  const output = document.getElementById('output');
  const input = document.getElementById('input');
  const prompt = document.querySelector('.prompt');
  const mainContent = document.getElementById('main-content');

  const commands = ['find', 'home', 'about', 'projects', 'contact', 'blog', 'help', 'clear'];

  let pendingHighlight = null;

  // Initial welcome message
  output.innerHTML = '<div class="terminal-welcome">Welcome to the portfolio terminal. Type "help" for available commands.</div>';

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const command = this.value.trim();
      output.innerHTML += `<div><span class="terminal-prompt">${prompt.textContent}</span><span class="terminal-command">${command}</span></div>`;
      processCommand(command);
      this.value = '';
      terminal.scrollTop = terminal.scrollHeight;
    } else if (event.key === 'Tab') {
      event.preventDefault();
      autocomplete(this);
    }
  });

  function autocomplete(inputElement) {
    const currentInput = inputElement.value.toLowerCase();
    const matchingCommands = commands.filter(cmd => cmd.startsWith(currentInput));

    if (matchingCommands.length === 1) {
      inputElement.value = matchingCommands[0];
    } else if (matchingCommands.length > 1) {
      output.innerHTML += `<div class="terminal-autocomplete">` + matchingCommands.join(' ') + '</div>';
      terminal.scrollTop = terminal.scrollHeight;
    }
  }

  function processCommand(command) {
    const parts = command.split(' ');
    const mainCommand = parts[0].toLowerCase();

    switch (mainCommand) {
      case 'find':
        if (parts.length < 2) {
          output.innerHTML += '<div class="terminal-error">Usage: find [search term] {optional: -page page_name}</div>';
        } else {
          let searchTerm = '';
          let page = 'all';
          let isPageFlag = false;

          for (let i = 1; i < parts.length; i++) {
            if (parts[i] === '-page') {
              isPageFlag = true;
            } else if (isPageFlag) {
              page = parts[i];
              isPageFlag = false;
            } else {
              searchTerm += (searchTerm ? ' ' : '') + parts[i];
            }
          }

          console.log(`Search term: "${searchTerm}", Page: ${page}`);
          findInContent(searchTerm, page);
        }
        break;
      case 'home':
      case 'about':
      case 'projects':
      case 'blog':
      case 'contact':
        navigateTo(mainCommand);
        break;
      case 'help':
        showHelp();
        break;
      case 'clear':
        output.innerHTML = '';
        break;
      default:
        output.innerHTML += `<div class="terminal-error">Command not recognized. Type "help" for available commands.</div>`;
    }
  }

  function findInBlogPosts(searchTerm, page = 'all') {
    console.log(`Searching for: "${searchTerm}" in blog posts`);
    output.innerHTML += `<span class="terminal-info">Searching for "${searchTerm}" in blog posts...</span>\n`;

    fetch(`/search-blog?term=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data);
        if (data.results.length > 0) {
          output.innerHTML += `<span class="terminal-success">Found ${data.results.length} result(s) for "${searchTerm}" in blog posts:</span>\n`;
          data.results.forEach((result, index) => {
            output.innerHTML += `<span class="result-number">[${index + 1}]</span> <span class="result-file">${result.file}:</span> <span class="result-excerpt">${result.excerpt}</span>\n`;
          });

          pendingHighlight = {
            searchTerm: data.searchTerm,
            results: data.results
          };

        } else {
          output.innerHTML += `<span class="terminal-warning">No results found for "${searchTerm}" in blog posts.</span>\n`;
        }
        terminal.scrollTop = terminal.scrollHeight;
      })
      .catch(error => {
        console.error('Error:', error);
        output.innerHTML += `<span class="terminal-error">An error occurred while searching blog posts.</span>\n`;
        terminal.scrollTop = terminal.scrollHeight;
      });
  }
  function findInContent(searchTerm, page = 'all') {
    console.log(`Searching for: "${searchTerm}" on page: ${page}`);
    output.innerHTML += `<span class="terminal-info">Searching for "${searchTerm}" on ${page === 'all' ? 'all pages' : page}...</span>\n`;

    fetch(`/search?term=${encodeURIComponent(searchTerm)}&page=${encodeURIComponent(page)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data);
        if (data.results.length > 0) {
          output.innerHTML += `<span class="terminal-success">Found ${data.results.length} result(s) for "${searchTerm}" ${page === 'all' ? 'across all pages' : `on ${page}`}:</span>\n`;
          data.results.forEach((result, index) => {
            let resultText = `<span class="result-number">[${index + 1}]</span> `;
            if (result.file.endsWith('.md')) {
              // This is a blog post result
              resultText += `<span class="result-file">Blog Post:</span> <span class="result-title">${result.title}</span>\n`;
            } else {
              // This is a regular page result
              resultText += `<span class="result-file">${result.file}:</span> <span class="result-excerpt">${result.excerpt}</span>\n`;
            }
            output.innerHTML += resultText;
          });

          pendingHighlight = {
            searchTerm: data.searchTerm,
            results: data.results
          };

          if (page !== 'all') {
            navigateTo(page);
          } else if (data.results.length > 0) {
            // Use the full path for navigation
            navigateTo(data.results[0].path.slice(1));
          }
        } else {
          output.innerHTML += `<span class="terminal-warning">No results found for "${searchTerm}" on ${page === 'all' ? 'any page' : page}.</span>\n`;
        }
        terminal.scrollTop = terminal.scrollHeight;
      })
      .catch(error => {
        console.error('Error:', error);
        output.innerHTML += `<span class="terminal-error">An error occurred while searching.</span>\n`;
        terminal.scrollTop = terminal.scrollHeight;
      });
  }

  function navigateTo(page) {
    console.log(`Navigating to: ${page}`);
    output.innerHTML += `<div class="terminal-success">Navigating to ${page}...</div>`;

    // Check if the page is a blog post
    const isBlogPost = page.startsWith('blog/');
    const url = isBlogPost ? `/${page}` : `/${page}`;

    htmx.ajax('GET', url, {
      target: '#main-content',
      swap: 'innerHTML',
      headers: {
        'HX-Request': 'true'
      }
    }).then(() => {
      console.log('HTMX request completed');
      history.pushState(null, '', url);
    });
  }

  function highlightSearchTerms(searchTerm, results) {
    console.log('Highlighting search terms:', searchTerm, results);
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
    const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT);

    let node;
    while (node = walker.nextNode()) {
      if (regex.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark>$&</mark>');
        node.parentNode.replaceChild(span, node);
      }
    }

    // Scroll to the first occurrence
    const firstMark = mainContent.querySelector('mark');
    if (firstMark) {
      firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Listen for HTMX after swap event
  document.body.addEventListener('htmx:afterSwap', function (evt) {
    console.log('HTMX after swap event triggered');
    if (pendingHighlight) {
      console.log('Pending highlight found:', pendingHighlight);
      highlightSearchTerms(pendingHighlight.searchTerm, pendingHighlight.results);
      pendingHighlight = null;
    } else {
      console.log('No pending highlight');
    }
  });

  function showHelp() {
    const helpText = `
        <div class="terminal-help">Available commands:</div>
        <div class="terminal-command">- find [search term] {optional: -page page_name}:</div> Search for a term across all pages or on a specific page
        <div class="terminal-command">- [page-name]:</div> Go to the [page-name]. Example: home
        <div class="terminal-command">- clear:</div> Clear the terminal
        <div class="terminal-command">- help:</div> Show this help message
        `;
    output.innerHTML += `<div>${helpText}</div>`;
  }
});
