import app from "./app.js";
import { envs } from "./configuration/envs.js";
import pkg from 'signale';
const { Signale } = pkg;
import AppDataSource from './provider/datasource-provider.js';

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