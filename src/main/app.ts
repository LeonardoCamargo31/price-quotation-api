import express from 'express'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

export class App {
  public app: express.Application
  public port: Number

  constructor (controllers) {
    this.app = express()
    this.port = parseInt(process.env.PORT, 10)
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
