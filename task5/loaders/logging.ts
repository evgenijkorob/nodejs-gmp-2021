import { AppLogger } from '../loggers';

export function setProcessLogging(logger: AppLogger): void {
  process.on('uncaughtException', (reason: Error) => {
    logger.error('uncaught exception', {
      instance: 'process',
      error: reason,
      stack: true
    });
  });

  process.on('unhandledRejection', (reason: Error) => {
    logger.warn('unhandled promise rejection', {
      instance: 'process',
      error: reason,
      stack: true
    });
  });
}
