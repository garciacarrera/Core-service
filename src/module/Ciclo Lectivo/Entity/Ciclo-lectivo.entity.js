import { EntitySchema } from "typeorm";
import CalendarioAcademicoSchema from "../../CalendarioAcademico/entity/calendario-academico.entity.js"; 
import CarreraSchema from "../../Carrera/entity/carrera.entity.js";

export default new EntitySchema({
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
    },

    estado: {
      type: "varchar",
      length: 50,
      nullable: false 
    }
  },
  relations: {
    carreras: {
      type: "one-to-many",
      target: CarreraSchema, 
      inverseSide: "cicloLectivo"
    },
    calendarios: {
      type: "one-to-many",
      target: CalendarioAcademicoSchema, 
      inverseSide: "cicloLectivo" 
    }
  }
});
