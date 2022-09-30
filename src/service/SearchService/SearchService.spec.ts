import { SearchService, ISearchService } from './SearchService'

interface sutTypes {
  sut: ISearchService
}

const makeSut = (): sutTypes => {
  const searchService = new SearchService()
  return {
    sut: searchService
  }
}

describe('Search Service',() => {
  it('should return a list of rooms', async () => {
    const { sut } = makeSut()

    const dataRequest = {
      checkin: '2022-11-26',
      checkout: '2022-11-30',
      adults: '2',
      destiny: 'test-only',
      hotelCode: '12'
    }

    const response = await sut.handler(dataRequest)
    expect(response.length).toBe(8)
  })
})
