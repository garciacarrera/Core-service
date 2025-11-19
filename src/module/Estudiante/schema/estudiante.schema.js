import Joi from 'joi';

export const estudianteSchema = Joi.object({
  
  nombre: Joi.string().max(100).required(),
  apellido: Joi.string().max(100).required(),
  dni: Joi.string().length(8).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'El DNI debe tener 8 dígitos.',
    'string.pattern.base': 'El DNI solo debe contener números.'
  }),
  fecha_nacimiento: Joi.date().less('now').required().messages({
    'date.less': 'La fecha de nacimiento no puede ser futura.'
  }),
  carrera_id: Joi.number().integer().optional(), 
});