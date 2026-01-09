/**
 * Simple Router for Single Page Application
 * Handles navigation between different views
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentView = null;
    this.beforeNavigate = null;
    this.historyStack = [];
  }

  /**
   * Register a route
   */
  register(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Navigate to a route
   */
  async navigate(path, params = {}) {
    // Call beforeNavigate hook if set
    if (this.beforeNavigate) {
      const canNavigate = await this.beforeNavigate(path, params);
      if (!canNavigate) return;
    }

    const handler = this.routes[path];

    if (handler) {
      const previousView = this.currentView;
      this.currentView = path;
      this.historyStack.push(path);

      // Log navigation for analytics
      if (window.DB) {
        await window.DB.logEvent('navigation', { from: previousView, to: path });
      }

      // Call the route handler with params
      await handler(params);

      // Update URL hash without triggering navigation
      window.location.hash = path;
    } else {
      console.error(`[Router] No route found for: ${path}`);
      this.navigate('/dashboard');
    }
  }

  /**
   * Set up hash change listener
   */
  init() {
    window.addEventListener('hashchange', () => {
      const path = window.location.hash.slice(1) || '/';
      this.navigate(path);
    });

    // Handle initial route
    const initialPath = window.location.hash.slice(1) || '/';
    this.navigate(initialPath);
  }

  /**
   * Set a hook to run before navigation
   */
  setBeforeNavigate(fn) {
    this.beforeNavigate = fn;
  }

  /**
   * Navigate back to previous route with a safe fallback
   */
  back(fallback = '/dashboard') {
    if (this.historyStack.length > 1) {
      // Remove current view
      this.historyStack.pop();
      const previous = this.historyStack.pop();
      if (previous) {
        this.navigate(previous);
        return;
      }
    }
    this.navigate(fallback);
  }
}

// Create singleton instance
const router = new Router();

// Export for use in other modules
window.Router = router;
