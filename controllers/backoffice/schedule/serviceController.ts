import { Request, Response } from "express";
import { Service } from "../../../models";
import { IdParams } from "../../../src/types/index";

export const getAllServices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const services = await Service.findAll({ where: { userId } });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter serviços" });
  }
};

export const getServiceById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const service = await Service.findOne({
      where: { serviceId: req.params.id, userId },
    });
    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter serviço" });
  }
};

export const createService = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!;
  const { name, duration, price, description, active } = req.body;
  try {
    const service = await Service.create({
      name,
      duration: Number(duration),
      price: Number(price),
      description: description || null,
      active: active !== undefined ? active : true,
      userId,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
};

export const updateService = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  const { name, duration, price, description, active } = req.body;
  try {
    const service = await Service.findOne({
      where: { serviceId: req.params.id, userId },
    });
    if (!service) return res.status(404).json({ error: "Serviço não encontrado" });

    const fields: Record<string, unknown> = {};
    if (name !== undefined) fields.name = name;
    if (duration !== undefined) fields.duration = Number(duration);
    if (price !== undefined) fields.price = Number(price);
    if (description !== undefined) fields.description = description;
    if (active !== undefined) fields.active = active;

    await Service.update(fields, { where: { serviceId: req.params.id, userId } });
    res.json({ message: "Serviço atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
};

export const deleteService = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  try {
    const service = await Service.findOne({
      where: { serviceId: req.params.id, userId },
    });
    if (!service) return res.status(404).json({ error: "Serviço não encontrado" });
    await Service.destroy({ where: { serviceId: req.params.id, userId } });
    res.json({ message: "Serviço eliminado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar serviço" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Gestão de serviços do cabeleireiro
 */

/**
 * @swagger
 * /schedule/services:
 *   get:
 *     summary: Listar todos os serviços
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */

/**
 * @swagger
 * /schedule/services/{id}:
 *   get:
 *     summary: Obter serviço por ID
 *     tags: [Services]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado
 */

/**
 * @swagger
 * /schedule/services:
 *   post:
 *     summary: Criar serviço
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, duration, price]
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 description: Duração em minutos
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Serviço criado
 */

/**
 * @swagger
 * /schedule/services/{id}:
 *   put:
 *     summary: Atualizar serviço
 *     tags: [Services]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *       404:
 *         description: Serviço não encontrado
 */

/**
 * @swagger
 * /schedule/services/{id}:
 *   delete:
 *     summary: Eliminar serviço
 *     tags: [Services]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço eliminado
 *       404:
 *         description: Serviço não encontrado
 */
