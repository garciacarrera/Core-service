import { EntitySchema } from "typeorm";

export default new EntitySchema({
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
    },
    // Columna para la clave foránea (FK)
    ciclo_lectivo_id: {
      type: "int",
      nullable: false
    }
  },
  relations: {
    cicloLectivo: {
      target: "CicloLectivo",
      type: "many-to-one",
      joinColumn: {
        name: "ciclo_lectivo_id",
        referencedColumnName: "id"
      },
      inverseSide: "calendarios",
      eager: true,
    }
  }
});
