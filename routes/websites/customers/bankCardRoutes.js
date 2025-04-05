const express = require('express');
const { createBankCard, getBankCards, updateBankCard, deleteBankCard } = require('../../../controllers/websites/customers/bankCardController');
const router = express.Router();

router.post('/', createBankCard);
router.get('/', getBankCards);
router.put('/:cardId', updateBankCard);
router.delete('/:cardId', deleteBankCard);

module.exports = router;
