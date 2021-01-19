import express from 'express';
import routes from './routes.js';

export default (config) => {
  const app = express();
  routes({ app, config });
  return app.listen(config.port);
};
