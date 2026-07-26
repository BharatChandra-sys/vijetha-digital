/**
 * Keep-Alive Service - PRODUCTION ONLY
 * Pings Render backend every 10 minutes to prevent it from sleeping
 * Only runs in production (Vercel), not in local development
 */

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
const HEALTH_ENDPOINT = "/health";
const IS_PRODUCTION = import.meta.env.PROD; // Vite's production flag

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isActive = false;
  }

  /**
   * Check if we should run keep-alive
   * Only in production AND only if backend is Render
   */
  shouldRun() {
    const isRenderBackend = BACKEND_URL.includes('render.com');
    return IS_PRODUCTION && isRenderBackend;
  }

  /**
   * Ping the backend health endpoint
   */
  async ping() {
    if (!this.shouldRun()) {
      return true; // Skip in development
    }

    try {
      const response = await fetch(`${BACKEND_URL}${HEALTH_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('[KeepAlive] ✅ Backend is alive');
        return true;
      } else {
        console.log('[KeepAlive] ⚠️ Backend responded with:', response.status);
        return false;
      }
    } catch (error) {
      console.log('[KeepAlive] ❌ Backend ping failed:', error.message);
      return false;
    }
  }

  /**
   * Start the keep-alive service (PRODUCTION ONLY)
   */
  start() {
    if (!this.shouldRun()) {
      console.log('[KeepAlive] 🏠 Running locally - keep-alive disabled');
      return;
    }

    if (this.isActive) {
      console.log('[KeepAlive] Already running');
      return;
    }

    console.log('[KeepAlive] 🚀 Starting keep-alive service (PRODUCTION)');
    console.log('[KeepAlive] Backend:', BACKEND_URL);
    console.log('[KeepAlive] Will ping every 10 minutes to prevent sleep');

    // Ping immediately on start
    this.ping();

    // Then ping every 10 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, PING_INTERVAL);

    this.isActive = true;
  }

  /**
   * Stop the keep-alive service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isActive = false;
      console.log('[KeepAlive] ⏹️ Stopped');
    }
  }

  /**
   * Wake up the backend (useful for first load)
   * Returns a promise that resolves when backend is ready
   */
  async wakeUp() {
    if (!this.shouldRun()) {
      return true; // Skip in development
    }

    console.log('[KeepAlive] 🔔 Waking up backend...');
    const success = await this.ping();
    
    if (!success) {
      console.log('[KeepAlive] ⏳ Backend is sleeping, retrying in 5s...');
      // Retry after 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await this.ping();
    }
    
    return success;
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;
