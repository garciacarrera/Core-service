import "reflect-metadata";
import { DataSource } from "typeorm";
import { envs } from "../configuration/envs.js";
// Se eliminan todas las importaciones de entidades para evitar el SyntaxError
// ya que las entidades deben usar 'export default' y este método es más fiable.

export const AppDataSource = new DataSource({
  type: "mysql",
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: false,
  logging: "all",
  
  // ✅ SOLUCIÓN: Usar un patrón (glob pattern) para que TypeORM cargue 
  // todas las entidades automáticamente, resolviendo el error de importación.
  entities: [
    "src/module/entity/*.entity.js",
  ],
});


export default AppDataSource;