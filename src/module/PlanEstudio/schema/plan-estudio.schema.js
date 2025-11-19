import Joi from "joi";

export const planEstudioSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  anio_educativo: Joi.number().integer().required(),
  carrera_id: Joi.number().integer().required() 
});
