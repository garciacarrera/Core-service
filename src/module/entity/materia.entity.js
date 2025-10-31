import { EntitySchema } from "typeorm";

export const Materia = new EntitySchema({
  name: "Materia",
  tableName: "materia",
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
    cant_horas: {
      type: "int",
      nullable: false
    }
  },
  relations: {
    periodo: {
      type: "many-to-one",
      target: "Periodo",
      joinColumn: {
        name: "periodo_id"
      }
    },
    planEstudio: {
      type: "many-to-one",
      target: "PlanEstudio",
      joinColumn: {
        name: "plan_estudio_id"
      }
    }
  }
});