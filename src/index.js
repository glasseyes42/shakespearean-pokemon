import express from 'express';

export default () => {
  const app = express();

  return app.listen(4567);
};
