import { DataSource } from "typeorm";
import { envs } from "../configuration/envs.js";
import { CicloLectivo } from "../module/entity/Ciclo-lectivo.entity.js";
import { Periodo } from "../module/entity/periodo.entity.js";
import { Carrera } from "../module/entity/carrera.entity.js";
import { PlanEstudio } from "../module/entity/plan-estudio.entity.js";
import { Materia } from "../module/entity/materia.entity.js";
import { CalendarioAcademico } from "../module/entity/calendario-academico-entity.js";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,        // ✅ Cambié DB_USERNAME a DB_USER
  password: envs.DB_PASSWORD,    // ✅ Esto está bien
  database: envs.DB_NAME,        // ✅ Cambié DB_DATABASE a DB_NAME
  synchronize: true,
  logging: true,
  entities: [
    CicloLectivo,
    Periodo,
    Carrera,
    PlanEstudio,
    Materia,
    CalendarioAcademico
  ]
});


export default AppDataSource;