/* eslint-disable @typescript-eslint/no-require-imports */
const logger = 
    typeof window === 'undefined'
        ? require('@/utils/logger.server').default
        : require('@/utils/logger.client').default

export default logger