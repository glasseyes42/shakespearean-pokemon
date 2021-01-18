import request from 'supertest';
import expect from 'expect';
import createApp from '../src/index.js';

const app = createApp();

describe('Service tests', () => {
  it('starts a basic service', () => request(app)
    .get('/')
    .expect(404));

  describe('API', () => {
    it('returns a description for a name', () => request(app)
      .get('/pokemon/charizard')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.name).toBe('charizard');
        expect(body.description).toBe('The flame inside its corse burns hotter than 3,600 degrees fahrenheit. At which hour charizard roars,  yond temperature climbs coequal higher.');
      }));
  });
});
