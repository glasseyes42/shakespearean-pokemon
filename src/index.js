import express from 'express';
import routes from './routes.js';

export default (config) => {
  const app = express();
  routes(app);
  return app.listen(config.port);
};
