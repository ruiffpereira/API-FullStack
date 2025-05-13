const express = require("express");
const router = express.Router();
const userPermissionController = require("../../../controllers/backoffice/admin/userPermissionController");

// Rota para atribuir uma permissão a um usuário
router.post("/", userPermissionController.checkUserPermission);
router.get("/", userPermissionController.getUserComponentsPermissions);

module.exports = router;
