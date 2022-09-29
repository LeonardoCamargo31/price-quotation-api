import { IRequest, IResponse } from '../../interfaces'
import express from 'express'
import Joi from '@hapi/joi'
import { getRulesSearch } from '../../utils/validator/rules'
import { extractErrors } from '../../utils/validator/extractErrors'
import { ISearchService } from '../../service/SearchService/SearchService'

export class SearchController {
  public router = express.Router()
  private readonly searchService: ISearchService

  constructor (searchService: ISearchService) {
    this.searchService = searchService
    this.setupRoutes()
  }

  private setupRoutes (): void {
    this.router.post('/search', this.handler.bind(this))
  }

  async handler (req: IRequest, res: IResponse): Promise<IResponse> {
    try {
      const { checkin, checkout } = req.body
      const joiSchema = getRulesSearch()
      const joiValidate = Joi.validate({ checkin, checkout }, joiSchema, {
        abortEarly: false,
        stripUnknown: true
      })

      if (joiValidate.error) {
        const validationErrors = extractErrors(joiValidate.error)
        return res.status(400).json({
          success: false,
          error: validationErrors
        })
      }

      const dataRequest = {
        checkin,
        checkout,
        adults: '2',
        destiny: 'Pratagy+Beach+Resort+All+Inclusive',
        hotelCode: '12'
      }

      const data = await this.searchService.handler(dataRequest)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
}
