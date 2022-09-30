import puppeteer from 'puppeteer'
import path from 'path'
import fileSystem from 'fs'

export interface ISearchService {
  handler: (dataRequest: DataRequest) => Promise<DataResponse[]>
}

export type DataRequest = {
  checkin: string
  checkout: string
  adults: string
  destiny: string
  hotelCode: string
}

export type DataResponse = {
  name: string
  description: string
  price: string
  image: string
}

type DataCookie = {
  name: string
  value: string
  domain: string
}

export class SearchService {
  private readonly domain = 'pratagy.letsbook.com.br'

  private createCookie (dataRequest: DataRequest): DataCookie {
    const cookieValue = JSON.stringify([{
      Chegada: dataRequest.checkin,
      Partida: dataRequest.checkout,
      CodigoHotel: dataRequest.hotelCode,
      Adultos: dataRequest.adults,
      Destino: dataRequest.destiny
    }])

    const cookie = {
      name: 'PRATAGY-PMW-SEARCHES',
      value: cookieValue,
      domain: this.domain
    }

    return cookie
  }

  private getPageData (): DataResponse[] {
    const results: DataResponse[] = []
    const items = document.querySelectorAll('tr.row-quarto')

    items.forEach((item) => {
      const elemImage = item.querySelector('.tdQuarto ul li')
      const styleImage = getComputedStyle(elemImage)
      results.push({
        name: item.querySelector('span.quartoNome').innerHTML,
        description: item.querySelector('.quartoDescricao>p').innerHTML,
        price: item.querySelector('span.valorFinal').innerHTML,
        image: styleImage.backgroundImage.slice(4, -1).replace(/"/g, '')
      })
    })
    return results
  }

  private async getPage (): Promise<puppeteer.Page> {
    const browser = await puppeteer.launch()
    return await browser.newPage()
  }

  async handler (dataRequest: DataRequest): Promise<DataResponse[]> {
    try {
      const url = `https://${this.domain}/D/Reserva/ConsultaDisponibilidade`
      const { checkin, checkout, adults, destiny, hotelCode } = dataRequest
      const request = `${url}?checkin=${checkin}&checkout=${checkout}&hotel=${hotelCode}&adultos=${adults}&destino=${destiny}`

      const cookie = this.createCookie(dataRequest)
      const page = await this.getPage()
      await page.setCookie(cookie)

      if (process.env.NODE_ENV === 'test') {
        const contents = fileSystem.readFileSync(path.join(__dirname, './test.html'))
        await page.setContent(contents.toString())
      } else {
        await page.goto(request)
      }

      const retult = await page.evaluate(this.getPageData)
      return retult
    } catch (error) {
      throw new Error(error)
    }
  }
}
