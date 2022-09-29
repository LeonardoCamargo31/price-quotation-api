import { IRequest, IResponse } from '../../interfaces'
import express from 'express'
import Joi from '@hapi/joi'
import { getRulesSearch } from '../../utils/validator/rules'
import { extractErrors } from '../../utils/validator/extractErrors'

export class SearchController {
  public router = express.Router()

  constructor () {
    this.setupRoutes()
  }

  private setupRoutes (): void {
    this.router.post('/search', this.handler.bind(this))
  }

  async handler (req: IRequest, res: IResponse): Promise<IResponse> {
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

    return res.status(200).json({})
  }
}
