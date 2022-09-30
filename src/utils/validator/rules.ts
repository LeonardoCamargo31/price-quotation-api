import Joi from '@hapi/joi'

export const getRulesSearch = (): any => {
  return Joi.object({
    checkin: Joi.date().iso().required(),
    checkout: Joi.date().iso().required()
  }).required()
}
