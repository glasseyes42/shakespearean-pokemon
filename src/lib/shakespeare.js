import superagent from 'superagent';
import logger from './logger.js';

const request = superagent.agent()
  .use((req) => {
    logger.debug(`pokeapi requesting - ${req.url}`);
  });

export default async (text) => {
  const result = await request
    .post('https://api.funtranslations.com/translate/shakespeare.json')
    .send({
      text,
    });

  return result.body.contents.translated;
};
