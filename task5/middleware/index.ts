import { ErrorRequestHandler, RequestHandler } from 'express';
import { createErrorResponse } from '../helpers';
import { AppLogger, AppLoggerArgInfo } from '../loggers';

export function handleAllErrors(logger: AppLogger): ErrorRequestHandler {
  // eslint-disable-next-line no-unused-vars
  return (error, _, res, __) => {
    if (!res.headersSent) {
      res.status(500).send(createErrorResponse('internal server error'));
    }

    logger.warn('unhandled internal server error', {
      instance: 'server',
      method: 'handleAllErrors',
      error,
      stack: true
    });
  };
}

function controllerRequestLogger(
  logger: AppLogger,
  controllerName: string,
  method: string,
  additionalArgsToLog?: AppLoggerArgInfo[]
): RequestHandler {
  return (req, _, next) => {
    const argsToLog: AppLoggerArgInfo[] = [
      { name: 'originalUrl', value: req.originalUrl },
      { name: 'url', value: req.url },
      { name: 'method', value: req.method },
      { name: 'query', value: req.query },
      { name: 'params', value: req.params },
      { name: 'body', value: req.body }
    ];

    if (additionalArgsToLog) {
      argsToLog.concat(additionalArgsToLog);
    }

    logger.info('will be called with', {
      instance: controllerName,
      method,
      args: argsToLog
    });

    next();
  };
}

// eslint-disable-next-line no-unused-vars
export type ControllerRequestLogger = (method: string, args?: AppLoggerArgInfo[]) => RequestHandler;

export function getControllerRequestLogger(
  logger: AppLogger,
  controllerName: string
): ControllerRequestLogger {
  return controllerRequestLogger.bind(null, logger, controllerName);
}
