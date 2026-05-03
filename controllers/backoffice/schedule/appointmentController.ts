import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Appointment, Service } from "../../../models";
import { IdParams } from "../../../src/types/index";

const mailer = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL || "", pass: process.env.PASSWORD || "" },
});

const notifyBarberNewAppointment = async (appointment: {
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  serviceName: string;
}) => {
  try {
    await mailer.sendMail({
      from: `Barbearia Tiago <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `Nova marcação — ${appointment.date} às ${appointment.time}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 32px; background: #1e293b; color: #f8fafc;">
          <h2 style="color: #f59e0b;">Nova marcação recebida</h2>
          <p><strong>Cliente:</strong> ${appointment.clientName}</p>
          <p><strong>Telefone:</strong> ${appointment.clientPhone}</p>
          <p><strong>Serviço:</strong> ${appointment.serviceName}</p>
          <p><strong>Data:</strong> ${appointment.date}</p>
          <p><strong>Hora:</strong> ${appointment.time}</p>
        </div>`,
    });
  } catch (err) {
    console.error("Erro ao notificar cabeleireiro:", err);
  }
};

export const getAllAppointments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  const { date, month, status } = req.query;
  try {
    const { Op } = await import("sequelize");
    const where: Record<string, unknown> = { userId };
    if (date) where.date = date;
    else if (month) {
      const [y, m] = month.toString().split("-").map(Number);
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
      where.date = { [Op.gte]: start, [Op.lt]: next };
    }
    if (status) where.status = status;

    const appointments = await Appointment.findAll({
      where,
      include: [{ model: Service, as: "service" }],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter marcações" });
  }
};

export const getAppointmentById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const appointment = await Appointment.findOne({
      where: { appointmentId: req.params.id, userId },
      include: [{ model: Service, as: "service" }],
    });
    if (!appointment) {
      res.status(404).json({ error: "Marcação não encontrada" });
      return;
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter marcação" });
  }
};

export const createAppointmentBO = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!;
  const { date, time, serviceId, clientName, clientEmail, clientPhone, notes } = req.body;
  try {
    const service = await Service.findOne({ where: { serviceId, userId } });
    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }
    const appointment = await Appointment.create({
      date,
      time,
      serviceId,
      clientName,
      clientEmail,
      clientPhone,
      notes: notes || null,
      status: "confirmed",
      userId,
    });
    await notifyBarberNewAppointment({
      clientName,
      clientPhone,
      date,
      time,
      serviceName: service.name,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar marcação" });
  }
};

export const updateAppointmentStatus = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  const { status, notes } = req.body;
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  try {
    const appointment = await Appointment.findOne({
      where: { appointmentId: req.params.id, userId },
    });
    if (!appointment) return res.status(404).json({ error: "Marcação não encontrada" });

    const fields: Record<string, unknown> = {};
    if (status) fields.status = status;
    if (notes !== undefined) fields.notes = notes;

    await Appointment.update(fields, {
      where: { appointmentId: req.params.id, userId },
    });
    res.json({ message: "Marcação atualizada" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar marcação" });
  }
};

export const deleteAppointment = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  try {
    const appointment = await Appointment.findOne({
      where: { appointmentId: req.params.id, userId },
    });
    if (!appointment) return res.status(404).json({ error: "Marcação não encontrada" });
    await Appointment.destroy({ where: { appointmentId: req.params.id, userId } });
    res.json({ message: "Marcação eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao eliminar marcação" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gestão de marcações (backoffice)
 */

/**
 * @swagger
 * /schedule/appointments:
 *   get:
 *     summary: Listar marcações
 *     tags: [Appointments]
 *     parameters:
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           example: "2026-05-15"
 *       - name: month
 *         in: query
 *         schema:
 *           type: string
 *           example: "2026-05"
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Lista de marcações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

/**
 * @swagger
 * /schedule/appointments:
 *   post:
 *     summary: Criar marcação manualmente (backoffice)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, time, serviceId, clientName, clientEmail, clientPhone]
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-05-15"
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               serviceId:
 *                 type: string
 *               clientName:
 *                 type: string
 *               clientEmail:
 *                 type: string
 *               clientPhone:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Marcação criada
 */

/**
 * @swagger
 * /schedule/appointments/{id}:
 *   put:
 *     summary: Atualizar estado ou notas da marcação
 *     tags: [Appointments]
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
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Marcação atualizada
 *       404:
 *         description: Marcação não encontrada
 */

/**
 * @swagger
 * /schedule/appointments/{id}:
 *   delete:
 *     summary: Eliminar marcação
 *     tags: [Appointments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marcação eliminada
 *       404:
 *         description: Marcação não encontrada
 */
