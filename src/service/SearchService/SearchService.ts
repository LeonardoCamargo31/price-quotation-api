import puppeteer from 'puppeteer'

export interface ISearchService {
  page: puppeteer.Page
  handler: (dataRequest: DataRequest) => Promise<DataResponse[]>
  accessPage: (request: string) => Promise<void>
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
  public page: puppeteer.Page

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

  private async getBrowser (): Promise<puppeteer.Browser> {
    return await puppeteer.launch()
  }

  private async closeBrowser (browser: puppeteer.Browser): Promise<void> {
    await browser.close()
  }

  private async getNewPage (browser: puppeteer.Browser): Promise<puppeteer.Page> {
    return await browser.newPage()
  }

  async accessPage (request: string): Promise<void> {
    await this.page.goto(request)
  }

  async handler (dataRequest: DataRequest): Promise<DataResponse[]> {
    try {
      const url = `https://${this.domain}/D/Reserva/ConsultaDisponibilidade`
      const { checkin, checkout, adults, destiny, hotelCode } = dataRequest
      const request = `${url}?checkin=${checkin}&checkout=${checkout}&hotel=${hotelCode}&adultos=${adults}&destino=${destiny}`

      const browser = await this.getBrowser()
      const cookie = this.createCookie(dataRequest)
      this.page = await this.getNewPage(browser)
      await this.page.setRequestInterception(true)
      await this.page.setCookie(cookie)

      this.page.on('request', async request => {
        if (request.url().includes(this.domain)) {
          console.log(`Request in URL: ${request.url()}`)
        }
        await request.continue()
      })

      await this.accessPage(request)
      const retult = await this.page.evaluate(this.getPageData)
      await this.closeBrowser(browser)
      return retult
    } catch (error) {
      throw new Error(error)
    }
  }
}
