// utils/logger.ts
import { createLogger, format, transports } from 'winston';
import * as Sentry from '@sentry/node';
import 'winston-transport';

const isDev = process.env.NODE_ENV === 'development';

class SentryTransport extends transports.Console {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(info: any, callback: () => void) {
        if (info.level === 'error') {
            Sentry.captureException(info.message);
        }
        callback();
    }
}

const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      silent: !isDev && process.env.LOG_LEVEL === 'silent',
    }),
    // Optional: File transport for error logs
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      silent: !isDev && process.env.LOG_LEVEL === 'silent',
    }),
    new SentryTransport({
      level: 'error',
      silent: !isDev && process.env.LOG_LEVEL === 'silent',
    }),
  ],
});

export default logger;
