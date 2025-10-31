import Joi from "joi";

export const cicloLectivoSchema = Joi.object({
  anio: Joi.number().integer().required(),
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required(),
  cant_dias: Joi.number().integer().required()
});

export const periodoSchema = Joi.object({
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required()
});


export const carreraSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  cant_anios: Joi.number().integer().required(),
  validacion: Joi.string().max(255).optional(),
  ciclo_lectivo_id: Joi.number().integer().required()
});


export const planEstudioSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  anio_educativo: Joi.number().integer().required(),
  carrera_id: Joi.number().integer().required()
});



export const materiaSchema = Joi.object({
  nombre: Joi.string().max(255).required(),
  cant_horas: Joi.number().integer().required(),
  periodo_id: Joi.number().integer().required(),
  plan_estudio_id: Joi.number().integer().required()
});

export const calendarioAcademicoSchema = Joi.object({
  fecha_inicio_inscripcion: Joi.date().required(),
  fecha_fin_inscripcion: Joi.date().required(),
  ciclo_lectivo_id: Joi.number().integer().required()
});
