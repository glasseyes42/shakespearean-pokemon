const log = console;

const wrapper = (level) => (...args) => {
  const [first, ...rest] = args;
  if (typeof first === 'string') {
    log[level](`[${level}] ${first}`, ...rest);
  } else {
    log[level](`[${level}]`, first, ...rest);
  }
};

const logger = {
  debug: wrapper('debug'),
  info: wrapper('info'),
  warn: wrapper('warn'),
  error: wrapper('error'),
};

export default logger;
