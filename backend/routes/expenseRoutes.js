const express = require("express");
const { 
    createExpense, 
    getExpenses, 
    getExpenseById,
    updateExpense, 
    deleteExpense, 
    getSpendingInsights 
} = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/insights", getSpendingInsights);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
