import Joi from '@hapi/joi'

export const regex = {
  isDate: /^\d{4}-\d{2}-\d{2}$/
}

export const getRulesSearch = (): any => {
  return Joi.object({
    checkin: Joi.string().regex(regex.isDate).required(),
    checkout: Joi.string().regex(regex.isDate).required()
  }).required()
}
