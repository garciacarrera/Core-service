import Joi from "joi";

export const carreraSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  cant_anios: Joi.number().integer().required(),
  validacion: Joi.string().max(255).optional(),
  ciclo_lectivo_id: Joi.number().integer().required()
});