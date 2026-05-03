import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Appointment extends Model<
  InferAttributes<Appointment>,
  InferCreationAttributes<Appointment>
> {
  declare appointmentId: CreationOptional<string>;
  declare date: string;
  declare time: string;
  declare serviceId: string;
  declare clientName: string;
  declare clientEmail: string;
  declare clientPhone: string;
  declare status: CreationOptional<"pending" | "confirmed" | "completed" | "cancelled">;
  declare notes: CreationOptional<string | null>;
  declare cancelToken: CreationOptional<string>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initAppointment(sequelize: Sequelize): void {
  Appointment.init(
    {
      appointmentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time: { type: DataTypes.STRING(5), allowNull: false },
      serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Services", key: "serviceId" },
      },
      clientName: { type: DataTypes.STRING, allowNull: false },
      clientEmail: { type: DataTypes.STRING, allowNull: false },
      clientPhone: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      notes: { type: DataTypes.TEXT, allowNull: true },
      cancelToken: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: "Appointment", tableName: "Appointments" },
  );
}
