const express = require("express");
const { addTransaction, getTransactions, deleteTransaction } = require("../controllers/transactionController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/new", authenticate, addTransaction);
router.get("/get", authenticate, getTransactions);
router.delete("/:id", authenticate, deleteTransaction);

module.exports = router;
