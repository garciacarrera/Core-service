import { EntitySchema } from "typeorm";

export const CicloLectivo = new EntitySchema({
  name: "CicloLectivo",
  tableName: "ciclo_lectivo",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    anio: {
      type: "int",
      nullable: false
    },
    fecha_inicio: {
      type: "date",
      nullable: false
    },
    fecha_fin: {
      type: "date",
      nullable: false
    },
    cant_dias: {
      type: "int",
      nullable: false
    }
  },
  relations: {
    carreras: {
      type: "one-to-many",
      target: "Carrera",
      inverseSide: "cicloLectivo"
    },
    calendarios: {
      type: "one-to-many",
      target: "CalendarioAcademico",
      inverseSide: "cicloLectivo"
    }
  }
});
