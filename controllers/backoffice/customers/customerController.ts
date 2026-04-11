import { Request, Response } from "express";
import { Customer } from "../../../models";
import { ApiError, CustomerResponse, IdParams } from "../../../src/types/index";

export const getAllCustomers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;
    const customers = await Customer.findAndCountAll({
      where: { userId: user },
    });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching customers" });
  }
};

export const getCustomerById = async (
  req: Request<IdParams>,
  res: Response<CustomerResponse | ApiError>,
): Promise<void> => {
  try {
    const userId = req.user;
    const customer = await Customer.findOne({
      where: { customerId: req.params.id, userId },
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the customer" });
  }
};

/**
 * @swagger
 * tags:
 *   name: BackofficeCustomers
 *   description: Backoffice management of customers
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [BackofficeCustomers]
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Error fetching customers
 */

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [BackofficeCustomers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Error fetching customer
 */
