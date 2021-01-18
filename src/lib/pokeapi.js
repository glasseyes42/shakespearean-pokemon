import superagent from 'superagent';
import logger from './logger.js';

const request = superagent.agent()
  .use((req) => {
    req.url = `https://pokeapi.co/api/v2${req.url}`;
    logger.debug(`pokeapi requesting - ${req.url}`);
  });

export default async (name) => {
  const pokemon = (await request.get(`/pokemon/${name}`)).body;
  const { species: { name: speciesName } } = pokemon;

  const species = (await request.get(`/pokemon-species/${speciesName}`)).body;

  return species.flavor_text_entries
    .filter((ft) => ft.language.name === 'en')
    .pop()
    .flavor_text;
};
