
import { makeApp } from './main/factory'

const app = makeApp()

const server = app.listen().then(() => {
  const port = app.port.toString()
  const env = app.app.get('env') as string
  console.log(
    `Application is running at http://localhost:${port} in ${env} mode`
  )
})

export default server
