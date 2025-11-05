import "reflect-metadata";
import { DataSource } from "typeorm";
import { envs } from "../configuration/envs.js";
import CicloLectivoEntity from "../module/Ciclo Lectivo/entity/Ciclo-lectivo.entity.js";
import calendarioAcademicoEntity from "../module/CalendarioAcademico/entity/calendario-academico.entity.js";
import carreraEntity from "../module/Carrera/entity/carrera.entity.js";
import estudianteEntity from "../module/Estudiante/entity/estudiante.entity.js";
import materiaEntity from "../module/Materia/entity/materia.entity.js";
import periodoEntity from "../module/Periodo/entity/periodo.entity.js";
import planEstudioEntity from "../module/PlanEstudio/entity/plan-estudio.entity.js";
import profesorEntity from "../module/Profesor/entity/profesor.entity.js";


export const AppDataSource = new DataSource({
  type: "mysql",
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    CicloLectivoEntity,
    calendarioAcademicoEntity,
    carreraEntity,
    estudianteEntity,
    materiaEntity,
    periodoEntity,
    planEstudioEntity,
    profesorEntity
  ]
});


export default AppDataSource;