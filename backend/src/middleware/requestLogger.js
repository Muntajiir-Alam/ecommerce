import morgan from 'morgan';
import logger from '../utils/logger.js';

const requestLogger = morgan('combined', {
    stream: {
        write: (message) => {
            try {
                logger.info(message.trim());
            } catch (error) {
                console.error('Morgan logger failed:', error.message);
            }
        },
    },
});

export default requestLogger;