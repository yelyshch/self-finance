const express = require("express");
const { createGoal, getGoals, updateGoal, deleteGoal } = require("../controllers/goalController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/new", authenticate, createGoal);
router.get("/get", authenticate, getGoals);
router.put("/:id", authenticate, updateGoal);
router.delete("/:id", authenticate, deleteGoal);

module.exports = router;
