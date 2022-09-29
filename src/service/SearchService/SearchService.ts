import puppeteer from 'puppeteer'

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

  async handler (dataRequest: DataRequest): Promise<DataResponse[]> {
    try {
      const url = `https://${this.domain}/D/Reserva/ConsultaDisponibilidade`
      const { checkin, checkout, adults, destiny, hotelCode } = dataRequest

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      const cookie = this.createCookie(dataRequest)
      await page.setCookie(cookie)

      await page.goto(`${url}?checkin=${checkin}&checkout=${checkout}&hotel=${hotelCode}&adultos=${adults}&destino=${destiny}`)

      const content = await page.evaluate(() => {
        const results = []
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
      })
      return content
    } catch (error) {
      throw new Error(error)
    }
  }
}
