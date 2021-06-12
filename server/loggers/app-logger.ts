// eslint-disable-next-line node/no-extraneous-import
import { Format, TransformableInfo } from 'logform';
import stringify from 'safe-stable-stringify';
import { createLogger, transports, format } from 'winston';

// eslint-disable-next-line no-unused-vars
type LeveledAppLogMethod = (message: string, meta: AppLoggerMeta) => AppLogger;

export interface AppLogger {
  error: LeveledAppLogMethod;
  warn: LeveledAppLogMethod;
  help: LeveledAppLogMethod;
  data: LeveledAppLogMethod;
  info: LeveledAppLogMethod;
  debug: LeveledAppLogMethod;
  prompt: LeveledAppLogMethod;
  http: LeveledAppLogMethod;
  verbose: LeveledAppLogMethod;
  input: LeveledAppLogMethod;
  silly: LeveledAppLogMethod;
}

export interface AppLoggerArgInfo {
  name: string;
  value: any;
}

export interface AppLoggerMeta {
  instance: string;
  method?: string;
  args?: AppLoggerArgInfo[];
  error?: Error;
  stack?: boolean;
}

interface AppFormatInput extends TransformableInfo, AppLoggerMeta {
  timestamp: string;
}

const appLogFormat: Format = format.printf((info: AppFormatInput): string => {
  const {
    timestamp,
    instance,
    method,
    level,
    message,
    args,
    error,
    stack
  } = info;
  let argsToLog = '';
  let errorToLog = '';

  if (args) {
    argsToLog = stringify(args);
  }

  if (error) {
    const isStackEnabled = stack || false;

    errorToLog = (isStackEnabled && error.stack) ? error.stack : `Error: ${error.message}`;
  }

  const instanceToPrint = method ? `${instance}:${method}` : instance;
  let resultToPrint = `${timestamp} [${instanceToPrint}] ${level.toUpperCase()}: ${message}`;

  resultToPrint += argsToLog ? `\nArgs: ${argsToLog}` : '';
  resultToPrint += errorToLog ? `\n${errorToLog}` : '';

  return resultToPrint;
});

export const appLogger: AppLogger = createLogger({
  exitOnError: false,
  transports: [
    new transports.Console({ handleExceptions: true })
  ],
  format: format.combine(
    format.timestamp(),
    appLogFormat
  )
});
