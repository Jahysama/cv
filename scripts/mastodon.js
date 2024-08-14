const instance = 'https://mastodon.social';
const username = '112950868045593874';

async function fetchLatestPost() {
    try {
        const response = await fetch(`${instance}/api/v1/accounts/${username}/statuses?limit=1`);
        const data = await response.json();
        
        if (data.length > 0) {
            const latestPost = data[0];
            displayPost(latestPost);
        } else {
            console.log('No posts found');
            document.getElementById('mastodon-post').innerHTML = '<p>No recent posts found.</p>';
        }
    } catch (error) {
        console.error('Error fetching Mastodon post:', error);
        document.getElementById('mastodon-post').innerHTML = '<p>Error loading the latest post.</p>';
    }
}

function displayPost(post) {
    const postElement = document.getElementById('mastodon-post');
    postElement.innerHTML = `
        <h2>My Thoughts Today</h2>
        <div>${post.content}</div>
        <p><small>Posted on: ${new Date(post.created_at).toLocaleString()}</small></p>
    `;
}

// Call the function when the page loads
fetchLatestPost();
