import { App } from './app'
import { SearchController } from '../controllers/SearchController/SearchController'
import { SearchService } from '../service/SearchService/SearchService'

export const makeApp = (): App => {
  const searchService = new SearchService()
  const searchController = new SearchController(searchService)

  const app = new App([searchController])
  return app
}
