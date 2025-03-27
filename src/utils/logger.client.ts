import * as Sentry from '@sentry/nextjs';
import { ENVS } from '@/utils/constants/envs';

export interface ConsoleLogger {
    error: (...msg: unknown[]) => void;
    info: (...msg: unknown[]) => void;
    log: (...msg: unknown[]) => void;
    warn: (...msg: unknown[]) => void;
    debug: (...msg: unknown[]) => void;
}

type Level = 'ERROR' | 'INFO' | 'WARN' | 'DEBUG' | 'LOG';

const log = (level: Level, ...messages: unknown[]) => {
    const timestamp = new Date().toISOString();
    const formattedPrefix = `[${timestamp}] [${level}] `;

    if (level === 'ERROR') {
        console.error(formattedPrefix, ...messages);
        // Capture errors in Sentry
        Sentry.captureException(messages.length === 1 ? messages[0] : messages);
    } else if (level !== "DEBUG" || ENVS.DEBUG) {
        // eslint-disable-next-line no-console
        console.log(formattedPrefix, ...messages);
    }
}

const logger: ConsoleLogger = {
    error: (...msg: unknown[]) => log('ERROR', ...msg), // console.error,
    info: (...msg: unknown[]) => log('INFO', ...msg), // console.info,
    log: (...msg: unknown[]) => log('LOG', ...msg), // console.log,
    warn: (...msg: unknown[]) => log('WARN', ...msg), // console.warn,
    debug: (...msg: unknown[]) => log('DEBUG', ...msg), // console.debug
}

export default logger;