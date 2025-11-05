import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Carrera",
  tableName: "carrera",
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
    cant_anios: {
      type: "int",
      nullable: false
    },
    validacion: {
      type: "varchar",
      length: 255,
      nullable: true
    }
  },
  relations: {
    cicloLectivo: {
      type: "many-to-one",
      target: "CicloLectivo",
      joinColumn: {
        name: "ciclo_lectivo_id"
      }
    },
    planesEstudio: {
      type: "one-to-many",
      target: "PlanEstudio",
      inverseSide: "carrera"
    }
  }
});
