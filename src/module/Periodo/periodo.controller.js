// src/module/Periodo/periodo.controller.js
import AppDataSource from "../../provider/datasource-provider.js";
import { periodoSchema } from "../Periodo/schema/periodo.schema.js";
import PeriodoEntity from "../Periodo/entity/periodo.entity.js";

// Repositorio directo
const PeriodoRepository = AppDataSource.getRepository(PeriodoEntity);

// Relaciones que se deben cargar con el período
const relations = ["materias"];

// --- GET ALL
export const getAllPeriodos = async (req, res) => {
  try {
    const periodos = await PeriodoRepository.find({ relations });
    return res.status(200).json(periodos);
  } catch (error) {
    console.error("Error al obtener períodos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getPeriodoById = async (req, res) => {
  try {
    const periodo = await PeriodoRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations
    });

    if (!periodo) {
      return res.status(404).json({ message: "Período no encontrado." });
    }

    return res.status(200).json(periodo);
  } catch (error) {
    console.error(`Error al obtener período ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createPeriodo = async (req, res) => {
  try {
    const { error, value } = periodoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Error de validación de datos.",
        details: error.details.map(d => d.message)
      });
    }

    const nuevoPeriodo = PeriodoRepository.create(value);
    await PeriodoRepository.save(nuevoPeriodo);

    return res.status(201).json(nuevoPeriodo);
  } catch (error) {
    console.error("Error al crear período:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear el período." });
  }
};

// --- PUT
export const updatePeriodo = async (req, res) => {
  try {
    const { error, value } = periodoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Error de validación de datos.",
        details: error.details.map(d => d.message)
      });
    }

    const periodoAActualizar = await PeriodoRepository.findOneBy({ id: parseInt(req.params.id) });

    if (!periodoAActualizar) {
      return res.status(404).json({ message: "Período no encontrado para actualizar." });
    }

    PeriodoRepository.merge(periodoAActualizar, value);
    const actualizado = await PeriodoRepository.save(periodoAActualizar);

    return res.status(200).json(actualizado);
  } catch (error) {
    console.error(`Error al actualizar período ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el período." });
  }
};

// --- DELETE
export const deletePeriodo = async (req, res) => {
  try {
    const resultado = await PeriodoRepository.delete(parseInt(req.params.id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Período no encontrado para eliminar." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar período ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al eliminar el período." });
  }
};
