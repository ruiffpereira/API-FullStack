const express = require("express");
const router = express.Router();
const { ClientController } = require("../controllers");

const clientController = new ClientController();

// Create Client
router.post("/client", async (req, res) => {
  const params = req.body;
  const data = await clientController.createClient(params);
  res.send(JSON.stringify(data));
});

// Get Client
router.get("/client", async (req, res) => {
  const params = req.body;
  const data = await clientController.readClient(params);
  res.send(JSON.stringify(data));
});

module.exports = router;
