import getDescription from './lib/pokeapi.js';
import createTranslate from './lib/shakespeare.js';

export default ({ app, config }) => {
  const translate = createTranslate(config);

  app.get('/pokemon/:name', async (req, res, next) => {
    try {
      const description = await getDescription(req.params.name);
      const translated = await translate(description);

      res.json({
        name: req.params.name,
        description: translated,
      });
    } catch (err) {
      if (err.status && (err.status === 404 || err.status === 429)) {
        return res.sendStatus(err.status);
      }
      next(err);
    }
  });
};
