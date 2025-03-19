const Expense = require("../models/expenseModel");

// Create an expense
const createExpense = async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;

        if (!amount || !category || !date) {
            return res.status(400).json({ message: "Amount, category, and date are required" });
        }

        const expense = new Expense({
            user: req.user.id,
            amount,
            category,
            date,
            description: description || ""
        });

        await expense.save();
        res.status(201).json({ message: "Expense added", expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get expenses with pagination and filters
const getExpenses = async (req, res) => {
    try {
        // Extract query parameters
        const { page = 1, limit = 10, startDate, endDate, category } = req.query;
        
        // Build filter query
        const filterQuery = { user: req.user.id };
        
        // Add date range filter if provided
        if (startDate || endDate) {
            filterQuery.date = {};
            if (startDate) filterQuery.date.$gte = new Date(startDate);
            if (endDate) filterQuery.date.$lte = new Date(endDate);
        }
        
        // Add category filter if provided
        if (category) {
            filterQuery.category = category;
        }
        
        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        // Get total count for pagination
        const total = await Expense.countDocuments(filterQuery);
        
        // Query expenses with pagination and sort by date (newest first)
        const expenses = await Expense.find(filterQuery)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNum);
        
        // Send response with pagination metadata
        res.json({
            expenses,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single expense by ID
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        
        // Check if expense exists
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        // Check if user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        res.json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;
        
        // Find expense
        let expense = await Expense.findById(req.params.id);
        
        // Check if expense exists
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        // Check if user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        // Update fields
        if (amount) expense.amount = amount;
        if (category) expense.category = category;
        if (date) expense.date = date;
        if (description !== undefined) expense.description = description;
        
        // Save updated expense
        await expense.save();
        
        res.json({ message: "Expense updated", expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        // Find expense
        const expense = await Expense.findById(req.params.id);
        
        // Check if expense exists
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        // Check if user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        // Delete expense
        await Expense.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Expense deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get spending insights
const getSpendingInsights = async (req, res) => {
    try {
        // Extract query parameters for date range
        const { startDate, endDate } = req.query;
        
        // Build match stage for aggregation
        const matchStage = { user: req.user.id };
        
        // Add date range if provided
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate);
        }
        
        // Aggregate to get total spending per category
        const categoryTotals = await Expense.aggregate([
            { $match: matchStage },
            { $group: { 
                _id: "$category", 
                total: { $sum: "$amount" } 
            }},
            { $sort: { total: -1 } }
        ]);
        
        // Calculate total spending across all categories
        const totalSpending = categoryTotals.reduce((sum, item) => sum + item.total, 0);
        
        // Calculate percentage for each category
        const insights = categoryTotals.map(item => ({
            category: item._id,
            total: item.total,
            percentage: totalSpending > 0 ? (item.total / totalSpending * 100).toFixed(2) : 0
        }));
        
        res.json({
            insights,
            totalSpending
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { 
    createExpense, 
    getExpenses, 
    getExpenseById,
    updateExpense, 
    deleteExpense,
    getSpendingInsights
};
