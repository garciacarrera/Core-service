import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Periodo",
  tableName: "periodo",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    fecha_inicio: {
      type: "date",
      nullable: false
    },
    fecha_fin: {
      type: "date",
      nullable: false
    }
  },
  relations: {
    materias: {
      type: "one-to-many",
      target: "Materia",
      inverseSide: "periodo"
    }
  }
});