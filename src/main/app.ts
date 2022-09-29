import express from 'express'
import * as dotenv from 'dotenv'
import path from 'path'
import bodyParser from 'body-parser'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export class App {
  public app: express.Application
  public port: Number

  constructor (controllers) {
    this.app = express()
    this.port = parseInt(process.env.PORT, 10)
    this.setupMiddlewares()
    this.setupControllers(controllers)
  }

  private setupControllers (controllers): void {
    controllers.forEach(controller => {
      this.app.use(controller.router)
    })
  }

  private setupMiddlewares (): void {
    this.app.use(bodyParser.json())
  }

  async listen (): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port.toString()}`)
        resolve()
      })
    })
  }
}
