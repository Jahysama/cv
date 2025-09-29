// Scroll to main content after HTMX content swap
document.body.addEventListener("htmx:afterSwap", function (event) {
  // Check if the swap target is main-content
  if (event.detail.target.id === "main-content") {
    // Scroll to the main content area
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});
