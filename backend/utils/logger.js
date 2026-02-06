// backend/utils/logger.js

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 * @returns {string} Formatted log message
 */
const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logData = data ? `\n${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level}] ${message}${logData}\n`;
};

/**
 * Write log to file
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
const writeLog = (level, message, data = null) => {
  const logMessage = formatLog(level, message, data);
  const fileName = `${new Date().toISOString().split('T')[0]}.log`;
  const filePath = path.join(logsDir, fileName);

  fs.appendFileSync(filePath, logMessage);
};

/**
 * Logger object
 */
const logger = {
  info: (message, data = null) => {
    console.log(`ℹ️  ${message}`);
    writeLog(LogLevel.INFO, message, data);
  },

  warn: (message, data = null) => {
    console.warn(`⚠️  ${message}`);
    writeLog(LogLevel.WARN, message, data);
  },

  error: (message, error = null) => {
    console.error(`❌ ${message}`);
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
    } : null;
    writeLog(LogLevel.ERROR, message, errorData);
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 ${message}`);
      writeLog(LogLevel.DEBUG, message, data);
    }
  },
};

module.exports = logger;
