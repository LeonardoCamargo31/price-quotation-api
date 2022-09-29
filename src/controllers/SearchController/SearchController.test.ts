import request from 'supertest'
import { App } from '../../main/app'
import { SearchController } from './SearchController'

const validData = {
  checkin: 'YYYY-MM-DD', // Check-in date
  checkout: 'YYYY-MM-DD' // Check-out date
}

interface sutTypes {
  sut: Express.Application
}

const makeSut = (): sutTypes => {
  const searchController = new SearchController()
  const app = new App([searchController])

  return {
    sut: app.app
  }
}

describe('Search Router', () => {
  test('should return status code 200', async () => {
    const { sut } = makeSut()
    const agent = request.agent(sut)

    await agent
      .post('/search')
      .send(validData)
      .expect(200)
  })
})
