import Joi from 'joi';

export const profesorSchema = Joi.object({
  
  nombre: Joi.string().max(255).required(),
  apellido: Joi.string().max(255).required(),
});