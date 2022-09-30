import { SearchService, ISearchService } from './SearchService'
import path from 'path'
import fileSystem from 'fs'

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

    const spyAccessPage = jest.spyOn(sut, 'accessPage')
      .mockImplementationOnce(async () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          const contents = fileSystem.readFileSync(path.join(__dirname, './test.html'))
          await sut.page.setContent(contents.toString())
          resolve()
        })
      })

    const response = await sut.handler(dataRequest)
    expect(response.length).toBe(8)
    expect(spyAccessPage).toBeCalledTimes(1)
  })
})
