import request from 'supertest'
import { App } from './app'

const app = new App([]).app

describe('GET /random-url', () => {
  test('Unknown URL should return 404', async () => {
    await request(app)
      .get('/unknown-url')
      .expect(404)
  })
})
