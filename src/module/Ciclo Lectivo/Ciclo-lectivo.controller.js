import { AppDataSource } from "../../provider/datasource-provider.js";
import CicloLectivoEntity from "../Ciclo Lectivo/entity/Ciclo-lectivo.entity.js";
import { cicloLectivoSchema } from "../Ciclo Lectivo/schema/Ciclo-lectivo.shema.js";

// Obtener el repositorio de CicloLectivo
const CicloLectivoRepository = AppDataSource.getRepository(CicloLectivoEntity);

/**
 * Obtiene todos los ciclos lectivos.
 * @param {import("express").Request} req - Objeto de solicitud de Express.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 */
export const getAllCiclosLectivos = async (req, res) => {
    try {
        const ciclos = await CicloLectivoRepository.find({
            relations: ["carreras", "calendarios"]
        });
        res.status(200).json(ciclos);
    } catch (error) {
        console.error("Error al obtener ciclos lectivos:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener ciclos lectivos." });
    }
};

/**
 * Obtiene un ciclo lectivo por su ID.
 * @param {import("express").Request} req - Objeto de solicitud de Express.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 */
export const getCicloLectivoById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const ciclo = await CicloLectivoRepository.findOne({
            where: { id },
            relations: ["carreras", "calendarios"]
        });

        if (!ciclo) {
            return res.status(404).json({ message: "Ciclo Lectivo no encontrado." });
        }

        res.status(200).json(ciclo);
    } catch (error) {
        console.error("Error al obtener ciclo lectivo por ID:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener el ciclo lectivo." });
    }
};

/**
 * Crea un nuevo ciclo lectivo.
 * @param {import("express").Request} req - Objeto de solicitud de Express.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 */
export const createCicloLectivo = async (req, res) => {
    try {
        // 1. Validación de datos con Joi
        const { error, value } = cicloLectivoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // 2. Validación lógica de fechas
        const { fecha_inicio, fecha_fin } = value;
        if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
            return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin." });
        }

        // 3. Creación y guardado
        const nuevoCiclo = CicloLectivoRepository.create(value);
        await CicloLectivoRepository.save(nuevoCiclo);

        res.status(201).json({ message: "Ciclo Lectivo creado exitosamente.", data: nuevoCiclo });
    } catch (error) {
        console.error("Error al crear ciclo lectivo:", error);
        res.status(500).json({ message: "Error interno del servidor al crear el ciclo lectivo." });
    }
};

/**
 * Actualiza un ciclo lectivo existente.
 * @param {import("express").Request} req - Objeto de solicitud de Express.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 */
export const updateCicloLectivo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cicloExistente = await CicloLectivoRepository.findOneBy({ id });

        if (!cicloExistente) {
            return res.status(404).json({ message: "Ciclo Lectivo no encontrado para actualizar." });
        }

        // 1. Validación de datos con Joi (permitiendo actualizaciones parciales si el esquema Joi lo permite)
        const { error, value } = cicloLectivoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // 2. Validación lógica de fechas
        const fechaInicio = value.fecha_inicio || cicloExistente.fecha_inicio;
        const fechaFin = value.fecha_fin || cicloExistente.fecha_fin;

        if (new Date(fechaInicio) >= new Date(fechaFin)) {
            return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin." });
        }

        // 3. Actualización y guardado
        const cicloActualizado = CicloLectivoRepository.merge(cicloExistente, value);
        await CicloLectivoRepository.save(cicloActualizado);

        res.status(200).json({ message: "Ciclo Lectivo actualizado exitosamente.", data: cicloActualizado });
    } catch (error) {
        console.error("Error al actualizar ciclo lectivo:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar el ciclo lectivo." });
    }
};

/**
 * Elimina un ciclo lectivo.
 * @param {import("express").Request} req - Objeto de solicitud de Express.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 */
export const deleteCicloLectivo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = await CicloLectivoRepository.delete(id);

        if (resultado.affected === 0) {
            return res.status(404).json({ message: "Ciclo Lectivo no encontrado para eliminar." });
        }

        res.status(200).json({ message: "Ciclo Lectivo eliminado exitosamente." });
    } catch (error) {
        // En caso de que haya restricciones de clave externa (Foreign Key), TypeORM lanzará un error.
        if (error.code === '23503') { // Código PostgreSQL para violación de Foreign Key
            return res.status(400).json({ 
                message: "No se puede eliminar este Ciclo Lectivo porque tiene Carreras o Calendarios Académicos asociados.",
                error: error.detail
            });
        }
        console.error("Error al eliminar ciclo lectivo:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar el ciclo lectivo." });
    }
};
