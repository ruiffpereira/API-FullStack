const express = require('express');
const { createComponent, getAllComponents, getComponentById, updateComponent, deleteComponent } = require('../controllers/componentsController');
const router = express.Router();

router.post('/', createComponent);
router.get('/', getAllComponents);
router.get('/:id', getComponentById);
router.put('/:id', updateComponent);
router.delete('/:id', deleteComponent);

module.exports = router;