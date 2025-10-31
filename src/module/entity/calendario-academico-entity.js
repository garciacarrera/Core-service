import { EntitySchema } from "typeorm";

export const CalendarioAcademico = new EntitySchema({
  name: "CalendarioAcademico",
  tableName: "calendario_academico",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    fecha_inicio_inscripcion: {
      type: "date",
      nullable: false
    },
    fecha_fin_inscripcion: {
      type: "date",
      nullable: false
    }
  },
  relations: {
    cicloLectivo: {
      type: "many-to-one",
      target: "CicloLectivo",
      joinColumn: {
        name: "ciclo_lectivo_id"
      }
    }
  }
});