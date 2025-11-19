// src/module/Carrera/carrera.controller.js
import AppDataSource from "../../provider/datasource-provider.js";
import { carreraSchema } from "../Carrera/schema/carrera.schema.js";
import CarreraEntity from "../Carrera/entity/carrera.entity.js";

const CarreraRepository = AppDataSource.getRepository(CarreraEntity);

// --- GET ALL ---
export const getAllCarreras = async (req, res) => {
  try {
    const carreras = await CarreraRepository.find({
      relations: ["cicloLectivo"]
    });

    return res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return res.status(500).json({ message: "Error interno del servidor al obtener las carreras." });
  }
};

// --- GET BY ID ---
export const getCarreraById = async (req, res) => {
  try {
    const carrera = await CarreraRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["cicloLectivo"]
    });

    if (!carrera) {
      return res.status(404).json({ message: "Carrera no encontrada." });
    }

    return res.status(200).json(carrera);
  } catch (error) {
    console.error("Error al obtener carrera:", error);
    return res.status(500).json({ message: "Error interno del servidor al obtener la carrera." });
  }
};

// --- POST ---
export const createCarrera = async (req, res) => {
  try {
    const { error, value } = carreraSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const nuevaCarrera = CarreraRepository.create(value);
    await CarreraRepository.save(nuevaCarrera);

    return res.status(201).json(nuevaCarrera);
  } catch (error) {
    console.error("Error al crear carrera:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear la carrera." });
  }
};

// --- PUT ---
export const updateCarrera = async (req, res) => {
  try {
    const { error, value } = carreraSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const carrera = await CarreraRepository.findOneBy({ id: parseInt(req.params.id) });

    if (!carrera) {
      return res.status(404).json({ message: "Carrera no encontrada." });
    }

    CarreraRepository.merge(carrera, value);
    const actualizada = await CarreraRepository.save(carrera);

    return res.status(200).json(actualizada);
  } catch (error) {
    console.error("Error al actualizar carrera:", error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar la carrera." });
  }
};

// --- DELETE ---
export const deleteCarrera = async (req, res) => {
  try {
    const result = await CarreraRepository.delete(parseInt(req.params.id));

    if (result.affected === 0) {
      return res.status(404).json({ message: "Carrera no encontrada." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar carrera:", error);
    return res.status(500).json({ message: "Error interno al eliminar la carrera." });
  }
};
