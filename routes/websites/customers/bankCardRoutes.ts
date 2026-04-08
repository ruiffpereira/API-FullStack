import { Router } from "express";
import {
  createBankCard,
  getBankCards,
  updateBankCard,
  deleteBankCard,
} from "../../../controllers/websites/customers/bankCardController";

const router = Router();

router.post("/", createBankCard);
router.get("/", getBankCards);
router.put("/:cardId", updateBankCard);
router.delete("/:cardId", deleteBankCard);

export default router;
