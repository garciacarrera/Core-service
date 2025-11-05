import Joi from "joi";

export const calendarioAcademicoSchema = Joi.object({
  fecha_inicio_inscripcion: Joi.date().required(),
  fecha_fin_inscripcion: Joi.date().required(),
  ciclo_lectivo_id: Joi.number().integer().required()
});
