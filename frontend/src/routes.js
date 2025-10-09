const routes = {
  "/": "<h1>Home</h1><p>Welcome to the Home page.</p>",
  "/about": "<h1>About</h1><p>Learn more about us on this page.</p>",
  "/contact": "<h1>Contact</h1><p>Contact us through this page.</p>",
};

export function renderRoute() {
  const path = window.location.pathname;
  const app = document.getElementById("app");
  app.innerHTML =
    routes[path] || "<h1>404 Not Found</h1><p>Page not found.</p>";
}

export function navigateTo(url) {
  history.pushState(null, null, url);
  renderRoute();
}
