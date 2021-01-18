import createConfig from './config/index.js';
import logger from './src/lib/logger.js';
import run from './src/index.js';

(async () => {
  try {
    const config = await createConfig();
    run(config);
    logger.info(`Application started, listening on port ${config.port}`);
  } catch (e) {
    logger.error(`Error starting application ${e.message}`, e);
    process.exit(1);
  }
})();
