import { EntitySchema } from 'typeorm';


export default new EntitySchema({
  name: 'Profesor',
  tableName: 'profesor',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: { 
      type: 'varchar',
      length: 255, 
      nullable: false 
    },
    apellido: { 
      type: 'varchar',
      length: 255,
      nullable: false
    },
  },
  relations: {
    materias: {
      target: 'Materia',
      type: 'many-to-many',
      inverseSide: 'profesores',
      joinTable: true, 
      eager: true,
    },
  },
});
