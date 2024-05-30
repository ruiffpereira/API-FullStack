const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers");

const userController = new UserController();

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const data = await userController.loginUser(email, password);
  res.send(JSON.stringify(data));
});

// Find User
router.get("/users", async (req, res) => {
  const { email } = req.body;
  const data = await userController.readUsers(email);
  res.send(JSON.stringify(data));
});

// Create User
router.post("/users", async (req, res) => {
  const params = req.body;
  const data = await userController.createUser(params);
  res.send(JSON.stringify(data));
});

// Delete User
router.delete("/users", async (req, res) => {
  const params = req.body;
  const data = await userController.deleteUser(params);
  res.send(JSON.stringify(data));
});

// Update User
router.put("/users", async (req, res) => {
  const params = req.body;
  const data = await userController.updateUser(params);
  res.send(JSON.stringify(data));
});

module.exports = router;
