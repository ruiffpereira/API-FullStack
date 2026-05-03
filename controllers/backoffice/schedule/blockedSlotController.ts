import { Request, Response } from "express";
import { BlockedSlot } from "../../../models";
import { IdParams } from "../../../src/types/index";

export const getBlockedSlots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  const { month } = req.query;
  try {
    const where: Record<string, unknown> = { userId };
    if (month) {
      const { Op } = await import("sequelize");
      const [y, m] = month.toString().split("-").map(Number);
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
      where.date = { [Op.gte]: start, [Op.lt]: next };
    }
    const slots = await BlockedSlot.findAll({ where, order: [["date", "ASC"]] });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter slots bloqueados" });
  }
};

export const createBlockedSlot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!;
  const { date, startTime, endTime, reason } = req.body;
  try {
    const slot = await BlockedSlot.create({
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || null,
      userId,
    });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ error: "Erro ao bloquear slot" });
  }
};

export const deleteBlockedSlot = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  try {
    const slot = await BlockedSlot.findOne({
      where: { blockedSlotId: req.params.id, userId },
    });
    if (!slot) return res.status(404).json({ error: "Slot não encontrado" });
    await BlockedSlot.destroy({ where: { blockedSlotId: req.params.id, userId } });
    res.json({ message: "Slot desbloqueado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao desbloquear slot" });
  }
};

/**
 * @swagger
 * tags:
 *   name: BlockedSlots
 *   description: Gestão de dias/horas bloqueadas
 */

/**
 * @swagger
 * /schedule/blocked-slots:
 *   get:
 *     summary: Listar slots bloqueados
 *     tags: [BlockedSlots]
 *     parameters:
 *       - name: month
 *         in: query
 *         schema:
 *           type: string
 *           example: "2026-05"
 *         description: Filtrar por mês (YYYY-MM)
 *     responses:
 *       200:
 *         description: Lista de slots bloqueados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlockedSlot'
 */

/**
 * @swagger
 * /schedule/blocked-slots:
 *   post:
 *     summary: Bloquear dia ou intervalo de horas
 *     tags: [BlockedSlots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date]
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-05-01"
 *               startTime:
 *                 type: string
 *                 example: "12:00"
 *                 description: Null = dia inteiro bloqueado
 *               endTime:
 *                 type: string
 *                 example: "14:00"
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Slot bloqueado
 */

/**
 * @swagger
 * /schedule/blocked-slots/{id}:
 *   delete:
 *     summary: Remover bloqueio
 *     tags: [BlockedSlots]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bloqueio removido
 *       404:
 *         description: Slot não encontrado
 */
