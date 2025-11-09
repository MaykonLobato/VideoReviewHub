/**
 * Centralized logging utility
 * Provides consistent logging across the application
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    if (!this.isDevelopment && level === 'debug') {
      return; // Don't log debug in production
    }

    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case 'error':
        console.error(formattedMessage, error || '');
        // In production, you could send errors to an error tracking service
        // Example: Sentry.captureException(error);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        if (this.isDevelopment) {
          console.info(formattedMessage);
        }
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
