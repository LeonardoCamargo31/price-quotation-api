import request from 'supertest'
import { App } from '../../main/app'
import { SearchController } from './SearchController'

const validData = {
  checkin: '2022-09-29',
  checkout: '2022-09-29'
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
  describe('success', () => {
    test('should return status code 200', async () => {
      const { sut } = makeSut()
      const agent = request.agent(sut)

      await agent
        .post('/search')
        .send(validData)
        .expect(200)
    })
  })

  describe('bad request', () => {
    test('should return status code 400, if invalid checkin', async () => {
      const { sut } = makeSut()
      const agent = request.agent(sut)

      await agent
        .post('/search')
        .send({
          ...validData,
          checkin: '20220531'
        })
        .expect(400)
        .then(res => {
          expect(res.body.error.errorDetail.checkin[0]).toBe('string.regex.base')
          expect(res.body.error.errorFields[0]).toBe('checkin')
        })
    })

    test('should return status code 400, if missing checkin param', async () => {
      const { sut } = makeSut()
      const agent = request.agent(sut)

      await agent
        .post('/search')
        .send({
          ...validData,
          checkin: undefined
        })
        .expect(400)
        .then(res => {
          expect(res.body.error.errorDetail.checkin[0]).toBe('any.required')
          expect(res.body.error.errorFields[0]).toBe('checkin')
        })
    })

    test('should return status code 400, if invalid checkout', async () => {
      const { sut } = makeSut()
      const agent = request.agent(sut)

      await agent
        .post('/search')
        .send({
          ...validData,
          checkout: '20220531'
        })
        .expect(400)
        .then(res => {
          expect(res.body.error.errorDetail.checkout[0]).toBe('string.regex.base')
          expect(res.body.error.errorFields[0]).toBe('checkout')
        })
    })

    test('should return status code 400, if missing checkout param', async () => {
      const { sut } = makeSut()
      const agent = request.agent(sut)

      await agent
        .post('/search')
        .send({
          ...validData,
          checkout: undefined
        })
        .expect(400)
        .then(res => {
          expect(res.body.error.errorDetail.checkout[0]).toBe('any.required')
          expect(res.body.error.errorFields[0]).toBe('checkout')
        })
    })
  })
})
