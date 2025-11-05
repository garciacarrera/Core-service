import Joi from "joi";

export const cicloLectivoSchema = Joi.object({
  anio: Joi.number().integer().required(),
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required(),
  cant_dias: Joi.number().integer().required(),
  estado: Joi.string().valid('habilitado', 'deshabilitado').required()
});