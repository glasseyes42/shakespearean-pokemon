import express from 'express';
import routes from './routes.js';

export default () => {
  const app = express();
  routes(app);
  return app.listen(4567);
};
