import { EntitySchema } from "typeorm";

export const PlanEstudio = new EntitySchema({
  name: "PlanEstudio",
  tableName: "plan_estudio",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    anio_educativo: {
      type: "int",
      nullable: false
    }
  },
  relations: {
    carrera: {
      type: "many-to-one",
      target: "Carrera",
      joinColumn: {
        name: "carrera_id"
      }
    },
    materias: {
      type: "one-to-many",
      target: "Materia",
      inverseSide: "planEstudio"
    }
  }
});