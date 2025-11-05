import { EntitySchema } from 'typeorm';
import CarreraEntity from '../../carrera/entity/carrera.entity.js';

export default new EntitySchema({
  name: 'Estudiante',
  tableName: 'estudiantes',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: { 
      type: 'varchar',
      length: 100,
      nullable: false
    },
    apellido: { 
      type: 'varchar',
      length: 100,
      nullable: false
    },
    dni: { 
      type: 'varchar',
      length: 8,
      unique: true,
      nullable: false
    },
    fecha_nacimiento: { 
      type: 'date',
      nullable: false
    },
  },
  relations: {
    carrera: {
      type: 'many-to-one',
      target: 'Carrera',
      joinColumn: {
        name: 'carrera_id',
      },
      nullable: true
    },
    materias: {
      target: 'Materia',
      type: 'many-to-many',
      joinTable: true,
      eager: false,
    },
  },
});
