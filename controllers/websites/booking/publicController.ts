import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import { Appointment, BlockedSlot, Service, User, WorkingHours } from "../../../models";

const mailer = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL || "", pass: process.env.PASSWORD || "" },
});

const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (m: number): string => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

const sendConfirmationEmail = async (opts: {
  businessName: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  cancelToken: string;
  cancelUrl: string;
}) => {
  try {
    await mailer.sendMail({
      from: `${opts.businessName} <${process.env.EMAIL}>`,
      to: opts.clientEmail,
      subject: `Marcação confirmada — ${opts.date} às ${opts.time}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px;">
          <div style="max-width: 520px; margin: auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
            <h2 style="color: #f59e0b; margin-top: 0;">Marcação Confirmada ✓</h2>
            <p>Olá <strong>${opts.clientName}</strong>,</p>
            <p>A tua marcação foi registada com sucesso.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 0; color: #94a3b8;">Serviço</td>
                <td style="padding: 10px 0; font-weight: bold;">${opts.serviceName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 0; color: #94a3b8;">Data</td>
                <td style="padding: 10px 0; font-weight: bold;">${opts.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 0; color: #94a3b8;">Hora</td>
                <td style="padding: 10px 0; font-weight: bold;">${opts.time}</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 0; color: #94a3b8;">Duração</td>
                <td style="padding: 10px 0; font-weight: bold;">${opts.duration} min</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8;">Preço</td>
                <td style="padding: 10px 0; font-weight: bold;">${opts.price}€</td>
              </tr>
            </table>
            <p style="margin-top: 24px; color: #94a3b8; font-size: 14px;">
              Se precisares de cancelar, clica no botão abaixo até 2 horas antes da marcação.
            </p>
            <a href="${opts.cancelUrl}"
               style="display: inline-block; margin-top: 12px; padding: 12px 24px; background: #ef4444; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Cancelar marcação
            </a>
            <p style="margin-top: 32px; color: #64748b; font-size: 12px;">${opts.businessName}</p>
          </div>
        </div>`,
    });
  } catch (err) {
    console.error("Erro ao enviar email de confirmação:", err);
  }
};

const sendCancellationEmail = async (opts: {
  businessName: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
}) => {
  try {
    await mailer.sendMail({
      from: `${opts.businessName} <${process.env.EMAIL}>`,
      to: opts.clientEmail,
      subject: `Marcação cancelada — ${opts.date} às ${opts.time}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px;">
          <div style="max-width: 520px; margin: auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
            <h2 style="color: #ef4444; margin-top: 0;">Marcação Cancelada</h2>
            <p>Olá <strong>${opts.clientName}</strong>,</p>
            <p>A tua marcação de <strong>${opts.serviceName}</strong> no dia <strong>${opts.date} às ${opts.time}</strong> foi cancelada com sucesso.</p>
            <p style="color: #94a3b8;">Podes fazer uma nova marcação quando quiseres.</p>
            <p style="margin-top: 32px; color: #64748b; font-size: 12px;">${opts.businessName}</p>
          </div>
        </div>`,
    });
  } catch (err) {
    console.error("Erro ao enviar email de cancelamento:", err);
  }
};

const notifyOwner = async (opts: {
  businessName: string;
  ownerEmail: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  date: string;
  time: string;
}) => {
  try {
    await mailer.sendMail({
      from: `${opts.businessName} <${process.env.EMAIL}>`,
      to: opts.ownerEmail,
      subject: `Nova marcação — ${opts.date} às ${opts.time}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h3>Nova marcação recebida</h3>
          <p><strong>Cliente:</strong> ${opts.clientName}</p>
          <p><strong>Telefone:</strong> ${opts.clientPhone}</p>
          <p><strong>Serviço:</strong> ${opts.serviceName}</p>
          <p><strong>Data:</strong> ${opts.date} às ${opts.time}</p>
        </div>`,
    });
  } catch (err) {
    console.error("Erro ao notificar o prestador:", err);
  }
};

export const getPublicServices = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = req.query as { userId: string };
  if (!userId) {
    res.status(400).json({ error: "userId obrigatório" });
    return;
  }
  try {
    const services = await Service.findAll({
      where: { userId, active: true },
      attributes: ["serviceId", "name", "duration", "price", "description"],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter serviços" });
  }
};

export const getAvailableSlots = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, date, serviceId } = req.query as {
    userId: string;
    date: string;
    serviceId: string;
  };

  if (!userId || !date || !serviceId) {
    res.status(400).json({ error: "userId, date e serviceId são obrigatórios" });
    return;
  }

  try {
    const service = await Service.findOne({ where: { serviceId, userId, active: true } });
    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }
    const duration = service.duration;

    const dayOfWeek = new Date(date).getDay();

    const workingDay = await WorkingHours.findOne({
      where: { userId, dayOfWeek, isActive: true },
    });
    if (!workingDay) {
      res.json([]);
      return;
    }

    const startMin = timeToMinutes(workingDay.startTime);
    const endMin = timeToMinutes(workingDay.endTime);

    const allSlots: number[] = [];
    for (let m = startMin; m + duration <= endMin; m += duration) {
      allSlots.push(m);
    }

    const existing = await Appointment.findAll({
      where: { userId, date, status: { [Op.ne]: "cancelled" } },
      include: [{ model: Service, as: "service", attributes: ["duration"] }],
    });

    const blocked = await BlockedSlot.findAll({ where: { userId, date } });

    const fullDayBlocked = blocked.some((b) => !b.startTime && !b.endTime);
    if (fullDayBlocked) {
      res.json([]);
      return;
    }

    const available = allSlots.filter((slotMin) => {
      const slotEnd = slotMin + duration;

      const overlapsAppointment = existing.some((appt) => {
        const apptStart = timeToMinutes(appt.time);
        const apptDuration = (appt as any).service?.duration ?? duration;
        const apptEnd = apptStart + apptDuration;
        return slotMin < apptEnd && slotEnd > apptStart;
      });
      if (overlapsAppointment) return false;

      const overlapsBlock = blocked.some((b) => {
        if (!b.startTime || !b.endTime) return false;
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return slotMin < bEnd && slotEnd > bStart;
      });
      if (overlapsBlock) return false;

      return true;
    });

    res.json(available.map(minutesToTime));
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular slots disponíveis" });
  }
};

export const createPublicAppointment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId, serviceId, date, time, clientName, clientEmail, clientPhone, notes } =
    req.body;

  if (!userId || !serviceId || !date || !time || !clientName || !clientEmail || !clientPhone) {
    res.status(400).json({ error: "Campos obrigatórios em falta" });
    return;
  }

  try {
    const [service, owner] = await Promise.all([
      Service.findOne({ where: { serviceId, userId, active: true } }),
      User.findOne({ where: { userId }, attributes: ["name", "email", "siteUrl"] }),
    ]);
    if (!service) {
      res.status(404).json({ error: "Serviço não encontrado" });
      return;
    }
    if (!owner) {
      res.status(404).json({ error: "Prestador não encontrado" });
      return;
    }

    const conflict = await Appointment.findOne({
      where: { userId, date, time, status: { [Op.ne]: "cancelled" } },
    });
    if (conflict) {
      res.status(409).json({ error: "Este horário já não está disponível" });
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
      status: "pending",
      userId,
    });

    const baseUrl = owner.siteUrl ?? process.env.BOOKING_SITE_URL ?? "http://localhost:5173";
    const cancelUrl = `${baseUrl}/cancelar/${appointment.cancelToken}`;

    sendConfirmationEmail({
      businessName: owner.name,
      clientName,
      clientEmail,
      serviceName: service.name,
      date,
      time,
      duration: service.duration,
      price: Number(service.price),
      cancelToken: appointment.cancelToken,
      cancelUrl,
    });
    notifyOwner({
      businessName: owner.name,
      ownerEmail: owner.email,
      clientName,
      clientPhone,
      serviceName: service.name,
      date,
      time,
    });

    res.status(201).json({
      appointmentId: appointment.appointmentId,
      date: appointment.date,
      time: appointment.time,
      serviceName: service.name,
      duration: service.duration,
      price: Number(service.price),
      status: appointment.status,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar marcação" });
  }
};

export const cancelPublicAppointment = async (
  req: Request<{ cancelToken: string }>,
  res: Response,
): Promise<void> => {
  const { cancelToken } = req.params;
  try {
    const appointment = await Appointment.findOne({
      where: { cancelToken },
      include: [{ model: Service, as: "service" }],
    });
    if (!appointment) {
      res.status(404).json({ error: "Marcação não encontrada" });
      return;
    }
    if (appointment.status === "cancelled") {
      res.status(400).json({ error: "Marcação já cancelada" });
      return;
    }
    if (appointment.status === "completed") {
      res.status(400).json({ error: "Não é possível cancelar uma marcação concluída" });
      return;
    }

    const owner = await User.findOne({
      where: { userId: appointment.userId },
      attributes: ["name"],
    });

    await Appointment.update({ status: "cancelled" }, { where: { cancelToken } });

    sendCancellationEmail({
      businessName: owner?.name ?? "Agenda",
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      serviceName: (appointment as any).service?.name ?? "",
      date: appointment.date,
      time: appointment.time,
    });

    res.json({ message: "Marcação cancelada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cancelar marcação" });
  }
};

export const getAppointmentByToken = async (
  req: Request<{ cancelToken: string }>,
  res: Response,
): Promise<void> => {
  const { cancelToken } = req.params;
  try {
    const appointment = await Appointment.findOne({
      where: { cancelToken },
      include: [{ model: Service, as: "service", attributes: ["name", "duration", "price"] }],
      attributes: ["appointmentId", "date", "time", "status", "clientName"],
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
