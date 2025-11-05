import app from "./app.js";
import { envs } from "./configuration/envs.js";
import pkg from 'signale';
const { Signale } = pkg;
import AppDataSource from './provider/datasource-provider.js';
import express from 'express';
import profesorRoutes from './src/api/profesor.routes.js'; 
import cicloLectivoRoutes from './src/module/academico/routes/ciclo-lectivo.routes.js';
import carreraRoutes from './src/module/carrera/routes/carrera.routes.js';
import materiaRoutes from './src/module/materia/routes/materia.routes.js'; 
import periodoRoutes from './src/module/academico/routes/periodo.routes.js';
import planEstudioRoutes from './src/module/planEstudio/routes/plan-estudio.routes.js';
import estudianteRoutes from './src/module/estudiante/routes/estudiante.routes.js';
import calendarioAcademicoRoutes from './src/module/academico/routes/calendario-academico.routes.js';

app.use(express.json());
app.use('/api/v1/profesores', profesorRoutes);
app.use('/api/v1/ciclos-lectivos', cicloLectivoRoutes);
app.use('/api/v1/carreras', carreraRoutes);
app.use('/api/v1/estudiantes', estudianteRoutes);
app.use('/api/v1/materias', materiaRoutes);
app.use('/api/v1/periodos', periodoRoutes);
app.use('/api/v1/planes-estudio', planEstudioRoutes)
app.use('/api/v1/calendarios-academicos', calendarioAcademicoRoutes);

const main = async () => {
    const logger = new Signale({ scope: 'Main' });
    
    try {
        await AppDataSource.initialize();
        logger.success('Conectado a la base de datos');
        
        app.listen(app.get('port'), () => {
            logger.success(`Servidor prendido en el puerto ${envs.PORT}`);
        });
        
    } catch (error) {
        logger.error('Error al iniciar:', error);
        process.exit(1);
    }
};

main();
