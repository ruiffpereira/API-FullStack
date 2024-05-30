const express = require("express");
const router = express.Router();
const { ServicesController } = require("../controllers");

const servicesController = new ServicesController();

// Create Services
router.post("/services", async (req, res) => {
  const params = req.body;
  const data = await servicesController.createServices(params);
  res.send(JSON.stringify(data));
});

// Update Services
router.put("/services", async (req, res) => {
  const params = req.body;
  const data = await servicesController.updateServices(params);
  res.send(JSON.stringify(data));
});

// delete Services
router.delete("/services", async (req, res) => {
  const params = req.body;
  const data = await servicesController.deleteService(params);
  res.send(JSON.stringify(data));
});

// Get Services
router.get("/services", async (req, res) => {
  const data = await servicesController.readServices();
  res.send(JSON.stringify(data));
});

module.exports = router;
