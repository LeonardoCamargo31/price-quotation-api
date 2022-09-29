import request from 'supertest'
import { App } from '../../main/app'
import { DataRequest, DataResponse, ISearchService } from '../../service/SearchService/SearchService'
import { SearchController } from './SearchController'

const validData = {
  checkin: '2022-09-29',
  checkout: '2022-09-29'
}

interface sutTypes {
  sut: Express.Application
  searchService: ISearchService
}

class SearchServiceStub implements ISearchService {
  async handler (dataRequest: DataRequest): Promise<DataResponse[]> {
    return [{
      name: 'STUDIO CASAL',
      description: 'Apartamentos localizados no prédio principal do Resort, próximos a recepção e a área de convivência, com vista para área de estacionamento não possuem varanda. Acomoda até 1 adulto e 1 criança ou 2 adultos',
      price: 'R$ 1.092,00',
      image: 'https://letsimage.s3.amazonaws.com/letsbook/193/quartos/30/fotoprincipal.jpg'
    },
    {
      name: 'CABANA',
      description: 'Apartamentos espalhados pelos jardins do Resort, com vista jardim possuem varanda. Acomoda até 4 adultos ou 3 adultos e 1 criança ou 2 adultos e 2 criança ou 1 adulto e 3 crianças, em duas camas casal.',
      price: 'R$ 1.321,00',
      image: 'https://letsimage.s3.amazonaws.com/letsbook/193/quartos/32/fotoprincipal.jpg'
    }]
  }
}

const makeSut = (): sutTypes => {
  const searchService = new SearchServiceStub()
  const searchController = new SearchController(searchService)
  const app = new App([searchController])

  return {
    sut: app.app,
    searchService
  }
}

describe('Search Router', () => {
  describe('success', () => {
    test('should return status code 200', async () => {
      const { sut, searchService } = makeSut()
      const agent = request.agent(sut)

      const spySearchService = jest.spyOn(searchService, 'handler')

      await agent
        .post('/search')
        .send(validData)
        .expect(200)
        .then(res => {
          expect(res.body.length).toBe(2)
        })

      expect(spySearchService).toBeCalledTimes(1)
      expect(spySearchService).toBeCalledWith(
        expect.objectContaining({
          checkin: '2022-11-26T00:00:00',
          checkout: '2022-11-30T00:00:00',
          adults: '2',
          destiny: 'Pratagy+Beach+Resort+All+Inclusive',
          hotelCode: '12'
        })
      )
    })
  })

  describe('error', () => {
    test('should return status code 500', async () => {
      const { sut, searchService } = makeSut()
      const agent = request.agent(sut)

      const spySearchService = jest.spyOn(searchService, 'handler')
        .mockImplementationOnce(async () => {
          return new Promise((resolve, reject) => reject(new Error('any_message')))
        })

      await agent
        .post('/search')
        .send(validData)
        .expect(500)
        .then(res => {
          expect(res.body).toBe('any_message')
        })

      expect(spySearchService).toBeCalledTimes(1)
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
