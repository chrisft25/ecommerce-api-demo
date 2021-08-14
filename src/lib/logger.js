const chalk = require('chalk');
const {
  isArray, isObject, isString, reduce, size, split, isError,
} = require('lodash');

const { log } = console;
const configuredLogLevel = process.env.LOG_LEVEL || 'ALL';
const customGroup = process.env.LOG_LEVEL_CUSTOM_GROUP;

const logPriorityGroups = {
  LOW: ['LOG', 'WARN', 'INFO'],
  MID: ['WARN', 'INFO', 'DEBUG'],
  HIGH: ['DEBUG', 'ERROR'],
  ALL: ['LOG', 'WARN', 'INFO', 'DEBUG', 'ERROR'],
  CUSTOM: split(customGroup, ','), // empty == off
  OFF: [],
};

const shouldLog = (logLevel) => {
  if (configuredLogLevel === 'ALL') {
    return true;
  }

  const current = logPriorityGroups[configuredLogLevel];
  return size(current.filter((group) => group === logLevel)) > 0;
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'function' && value !== null) {
      return `[Function: ${`${key} = ` || ''}${value}]`;
    } if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '';
      seen.add(value);
    }
    return value;
  };
};

const stringify = (json) => {
  try {
    return JSON.stringify(json, getCircularReplacer(), 2);
  } catch (e) {
    return json;
  }
};

const clear = (str) => {
  if (isError(str)) return `Name: ${str.name}\nMessage: ${str.message}\nStack: ${str.stack}`;
  return ((!isString(str) && (isArray(str) || isObject(str))) ? `${stringify(str)}` : str);
};

const message = (strs) => reduce(strs, (result, str) => `${result} ${clear(str)}`, '');
const prefix = (type, name) => `${type} (${name}):`;

module.exports = ({ name = 'logger' }) => ({
  log: (...strs) => {
    if (shouldLog('LOG')) log(chalk.white.bold(prefix('LOG  ', name)), chalk.white(message(strs)));
  },
  warn: (...strs) => {
    if (shouldLog('WARN')) log(chalk.yellow.bold(prefix('WARN ', name)), chalk.yellow(message(strs)));
  },
  info: (...strs) => {
    if (shouldLog('INFO')) log(chalk.green.bold(prefix('INFO ', name)), chalk.green(message(strs)));
  },
  debug: (...strs) => {
    if (shouldLog('DEBUG')) log(chalk.cyan.bold(prefix('DEBUG', name)), chalk.cyan(message(strs)));
  },
  error: (...strs) => {
    if (shouldLog('ERROR')) log(chalk.red.bold(prefix('ERROR', name)), chalk.red(message(strs)));
  },
});
