import request from 'supertest';
import expect from 'expect';
import nock from 'nock';

import config from '../config/index.js';
import createApp from '../src/index.js';
import testCases from './data/translate.js';

const createSimplePokeapiNock = () => nock('https://pokeapi.co/api')
  .get('/v2/pokemon/anything')
  .reply(200, { species: { name: 'anything' } })
  .get('/v2/pokemon-species/anything')
  .reply(200, {
    flavor_text_entries: [{
      flavor_text: 'description text',
      language: { name: 'en' },
    }],
  });

describe('Service tests', async () => {
  let app;
  before(async () => {
    app = createApp(await config());
  });

  it('starts a basic service', () => request(app)
    .get('/')
    .expect(404));

  describe('API', () => {
    describe('GET /pokemon/:pokemon', () => {
      testCases.forEach(testCase => {
        const pokeapiNock = nock('https://pokeapi.co/api')
          .get(`/v2/pokemon/${testCase.name}`)
          .reply(200, testCase.pokemonResponse)
          .get(`/v2/pokemon-species/${testCase.pokemonResponse.species.name}`)
          .reply(200, testCase.speciesResponse);

        const translateNock = nock('https://api.funtranslations.com')
          .post('/translate/shakespeare.json', {
            text: testCase.translatorBody,
          })
          .reply(200, {
            contents: {
              translated: testCase.translated,
            },
          });

        it(`returns a description for a name [${testCase.name}]`, () => request(app)
          .get(`/pokemon/${testCase.name}`)
          .expect(200)
          .then(({ body }) => {
            expect(body).toBeDefined();
            expect(body.name).toBe(testCase.name);
            expect(body.description).toBe(testCase.translated);

            expect(pokeapiNock.isDone()).toBe(true);
            expect(translateNock.isDone()).toBe(true);
          }));
      });

      it('should return not found for an unknown pokemon', async () => {
        const pokeapiNock = nock('https://pokeapi.co/api')
          .get('/v2/pokemon/does-not-exist')
          .reply(404);

        await request(app)
          .get('/pokemon/does-not-exist')
          .expect(404);

        expect(pokeapiNock.isDone()).toBe(true);
      });

      it('should return too many requests if translation api is exceeded', async () => {
        const pokeapiNock = createSimplePokeapiNock();
        const translateNock = nock('https://api.funtranslations.com')
          .post('/translate/shakespeare.json')
          .reply(429);

        await request(app)
          .get('/pokemon/anything')
          .expect(429);

        expect(pokeapiNock.isDone()).toBe(true);
        expect(translateNock.isDone()).toBe(true);
      });

      it('should return failure if upstream api fails', async () => {
        const pokeapiNock = nock('https://pokeapi.co/api')
          .get('/v2/pokemon/anything')
          .reply(500);

        await request(app)
          .get('/pokemon/anything')
          .expect(500);

        expect(pokeapiNock.isDone()).toBe(true);
      });

      describe('funtranslations auth', () => {
        let authedApp;

        before(async () => {
          const authConfig = {
            ...await config(),
            port: 14568,
            translateToken: 'abcdef',
          };
          authedApp = createApp(authConfig);
        });

        it('uses an auth header for funtranslations if configured', async () => {
          const pokeapiNock = createSimplePokeapiNock();

          const translateNock = nock('https://api.funtranslations.com', {
            reqheaders: {
              'x-funtranslations-api-secret': 'abcdef',
            },
          }).post('/translate/shakespeare.json', { text: 'description text' })
            .reply(200, {
              contents: { translated: 'translated' },
            });

          await request(authedApp)
            .get('/pokemon/anything')
            .expect(200)
            .then(({ body }) => {
              expect(body).toBeDefined();
              expect(body.description).toBe('translated');

              expect(pokeapiNock.isDone()).toBe(true);
              expect(translateNock.isDone()).toBe(true);
            });
        });
      });
    });
  });
});
