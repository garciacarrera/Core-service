import Joi from "joi";

export const periodoSchema = Joi.object({
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required()
});