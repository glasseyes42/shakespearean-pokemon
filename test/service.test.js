import request from 'supertest';
import createApp from '../src/index.js';

const app = createApp();

describe('Service tests', () => {
  it('starts a basic service', () => request(app)
    .get('/')
    .expect(404));
});
