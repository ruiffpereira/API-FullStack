const express = require('express');
const { createAddress, getAddresses, updateAddress, deleteAddress } = require('../../../controllers/websites/customers/adressController');
const router = express.Router();

router.post('/', createAddress);
router.get('/', getAddresses);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

module.exports = router;