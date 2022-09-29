import { IRequest, IResponse } from '../../interfaces'
import express from 'express'

export class SearchController {
  public router = express.Router()

  constructor () {
    this.setupRoutes()
  }

  private setupRoutes (): void {
    this.router.post('/search', this.handler.bind(this))
  }

  async handler (req: IRequest, res: IResponse): Promise<IResponse> {
    return res.status(200).json({})
  }
}
