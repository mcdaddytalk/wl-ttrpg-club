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
    if (level === 'ERROR') {
        console.error(`[${timestamp}] [${level}] `, ...messages);
    } else {
        console.log(`[${timestamp}] [${level}] `, ...messages);
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