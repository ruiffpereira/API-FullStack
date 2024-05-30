const express = require("express");
const router = express.Router();
const { SchedulesController } = require("../controllers");

const schedulesController = new SchedulesController();

// Create Schedules
router.post("/schedules", async (req, res) => {
  const params = req.body;
  console.log(params);
  const data = await schedulesController.createSchedules(params);
  res.send(JSON.stringify(data));
});

// Update Schedules
router.put("/schedules", async (req, res) => {
  const params = req.body;
  console.log(params);
  const data = await schedulesController.updateSchedules(params);
  res.send(JSON.stringify(data));
});

// delete Schedules
router.delete("/schedules", async (req, res) => {
  const params = req.body;
  const data = await schedulesController.deleteSchedules(params);
  res.send(JSON.stringify(data));
});

// Get Schedules
router.get("/schedules", async (req, res) => {
  const data = await schedulesController.readSchedules();
  res.send(JSON.stringify(data));
});

module.exports = router;
