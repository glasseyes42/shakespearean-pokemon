import request from 'supertest';
import expect from 'expect';
import nock from 'nock';

import createApp from '../src/index.js';
import testCases from './data/translate.js';

const app = createApp();

describe('Service tests', () => {
  it('starts a basic service', () => request(app)
    .get('/')
    .expect(404));

  describe('API', () => {
    describe('translate', () => {
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
    });
  });
});
