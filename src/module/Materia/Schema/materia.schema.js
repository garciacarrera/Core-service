import Joi from "joi";

export const materiaSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  cant_horas: Joi.number().integer().required(),
  periodo_id: Joi.number().integer().required(),
  plan_estudio_id: Joi.number().integer().required()
});