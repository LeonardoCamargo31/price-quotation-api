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
        const contents = fileSystem.readFileSync(path.join(__dirname, './test.html'))
        await sut.page.setContent(contents.toString())
      })

    const response = await sut.handler(dataRequest)
    expect(response.length).toBe(8)
    expect(spyAccessPage).toBeCalledTimes(1)
  })

  it('should throw a new error', async () => {
    const { sut } = makeSut()

    const dataRequest = {
      checkin: '2022-11-26',
      checkout: '2022-11-30',
      adults: '2',
      destiny: 'test-only',
      hotelCode: '12'
    }

    jest.spyOn(sut, 'accessPage')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error('any_message')))
      })

    const promise = sut.handler(dataRequest)
    await expect(promise).rejects.toThrow(
      new Error('Error: any_message')
    )
  })
})
