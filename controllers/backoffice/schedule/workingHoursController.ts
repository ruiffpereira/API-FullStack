import { Request, Response } from "express";
import { WorkingHours } from "../../../models";
import { IdParams } from "../../../src/types/index";

export const getWorkingHours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const hours = await WorkingHours.findAll({
      where: { userId },
      order: [["dayOfWeek", "ASC"]],
    });
    res.json(hours);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter horários" });
  }
};

export const upsertWorkingHours = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!;
  // Expects array: [{ dayOfWeek, startTime, endTime, isActive }]
  const { hours } = req.body as {
    hours: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[];
  };
  try {
    for (const h of hours) {
      await WorkingHours.upsert({
        ...h,
        userId,
      });
    }
    res.json({ message: "Horários guardados com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao guardar horários" });
  }
};

export const deleteWorkingHours = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  try {
    const wh = await WorkingHours.findOne({
      where: { workingHoursId: req.params.id, userId },
    });
    if (!wh) return res.status(404).json({ error: "Horário não encontrado" });
    await WorkingHours.destroy({ where: { workingHoursId: req.params.id, userId } });
    res.json({ message: "Horário eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar horário" });
  }
};

/**
 * @swagger
 * tags:
 *   name: WorkingHours
 *   description: Gestão de horários de trabalho
 */

/**
 * @swagger
 * /schedule/working-hours:
 *   get:
 *     summary: Obter horários de trabalho
 *     tags: [WorkingHours]
 *     responses:
 *       200:
 *         description: Lista de horários por dia da semana
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkingHours'
 */

/**
 * @swagger
 * /schedule/working-hours:
 *   post:
 *     summary: Guardar horários de trabalho (upsert por dia)
 *     tags: [WorkingHours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: integer
 *                       description: 0=Domingo, 1=Segunda, ..., 6=Sábado
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       example: "18:00"
 *                     isActive:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Horários guardados
 */

/**
 * @swagger
 * /schedule/working-hours/{id}:
 *   delete:
 *     summary: Eliminar horário
 *     tags: [WorkingHours]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horário eliminado
 *       404:
 *         description: Horário não encontrado
 */
