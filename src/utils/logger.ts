import { ConsoleLogger } from '@/utils/logger.client';
import consoleLogger from '@/utils/logger.client';
// import winston from 'winston';

// let logger: winston.Logger | ConsoleLogger;

// if (typeof window === 'undefined') {
//    const { default: serverLogger } = await import('@/utils/logger.server')
//    logger = serverLogger
//} else {
    // const { default: clientLogger } = await import('@/utils/logger.client')
    const clientLogger = consoleLogger;
    const logger: ConsoleLogger = clientLogger
//}

export default logger