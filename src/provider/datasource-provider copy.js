import "reflect-metadata";
import { DataSource } from "typeorm";
import { envs } from "../configuration/envs.js";
// ❌ ELIMINAMOS las importaciones directas de las entidades.
// import { CicloLectivo } from "../module/entity/Ciclo-lectivo.entity.js";
// import { Periodo } from "../module/entity/periodo.entity.js";
// ... y el resto de las importaciones.

export const AppDataSource = new DataSource({
type: "mysql",
host: envs.DB_HOST,
port: envs.DB_PORT,
username: envs.DB_USER,
password: envs.DB_PASSWORD,
database: envs.DB_NAME,
synchronize: true,
logging: true,
 
  // ✅ CAMBIO CLAVE: Usar un array de strings (glob pattern)
  // TypeORM buscará todos los archivos que terminen en .entity.js 
  // dentro de la carpeta module/entity/.
entities: [
    "src/module/entity/*.entity.js",
  ],
});


export default AppDataSource;
