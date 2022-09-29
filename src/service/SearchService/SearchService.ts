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

export class SearchService {
  async handler (dataRequest: DataRequest): Promise<DataResponse[]> {
    try {
      const domain = 'pratagy.letsbook.com.br'
      const url = `https://${domain}/D/Reserva/ConsultaDisponibilidade`
      const checkin = dataRequest.checkin
      const checkout = dataRequest.checkout
      const adults = dataRequest.adults
      const destiny = dataRequest.destiny
      const hotelCode = dataRequest.hotelCode

      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      const cookieValue = JSON.stringify([{
        Chegada: checkin,
        Partida: checkout,
        CodigoHotel: hotelCode,
        Adultos: adults,
        Destino: destiny
      }])

      await page.setCookie({
        name: 'PRATAGY-PMW-SEARCHES',
        value: cookieValue,
        domain: domain
      })

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
