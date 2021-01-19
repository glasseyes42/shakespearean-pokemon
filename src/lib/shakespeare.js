import superagent from 'superagent';
import logger from './logger.js';

const request = superagent.agent()
  .use((req) => {
    logger.debug(`funtranslations api requesting - ${req.url}`);
  });

export default (config) =>
  async (text) => {
    const req = request
      .post('https://api.funtranslations.com/translate/shakespeare.json')
      .send({
        text,
      });

    if (config.translateToken) req.set('x-funtranslations-api-secret', config.translateToken);

    const result = await req;

    return result.body.contents.translated;
  };
