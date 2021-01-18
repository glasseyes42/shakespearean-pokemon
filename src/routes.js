import getDescription from './lib/pokeapi.js';
import translate from './lib/shakespeare.js';

export default (app) => {
  app.get('/pokemon/:name', async (req, res, next) => {
    try {
      const description = await getDescription(req.params.name);
      const translated = await translate(description);

      res.json({
        name: req.params.name,
        description: translated,
      });
    } catch (err) {
      next(err);
    }
  });
};
