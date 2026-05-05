/**
 * Production-ready logging utility
 * Automatically disables console logs in production
 */

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

class Logger {
  constructor() {
    this.isDev = isDevelopment;
  }

  /**
   * Log informational messages (only in development)
   */
  log(...args) {
    if (this.isDev) {
      console.log(...args);
    }
  }

  /**
   * Log errors (always logged, sent to error tracking in production)
   */
  error(...args) {
    if (isProduction) {
      // In production, send to error tracking service (Sentry, etc.)
      // For now, we'll still log to console but could be disabled
      console.error(...args);
      // TODO: Send to error tracking service
      // this.sendToErrorTracking(args);
    } else {
      console.error(...args);
    }
  }

  /**
   * Log warnings (only in development)
   */
  warn(...args) {
    if (this.isDev) {
      console.warn(...args);
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(...args) {
    if (this.isDev) {
      console.debug(...args);
    }
  }

  /**
   * Log API errors with context
   */
  apiError(endpoint, error, context = {}) {
    const errorData = {
      endpoint,
      message: error?.response?.data?.detail || error?.message || 'Unknown error',
      status: error?.response?.status,
      context,
      timestamp: new Date().toISOString(),
    };

    if (isProduction) {
      // Send to error tracking
      console.error('API Error:', errorData);
      // TODO: Send to error tracking service
    } else {
      console.error('API Error:', errorData);
    }
  }

  /**
   * Send error to tracking service (placeholder)
   */
  sendToErrorTracking(error) {
    // TODO: Implement Sentry or other error tracking
    // Example: Sentry.captureException(error);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export as default for convenience
export default logger;
