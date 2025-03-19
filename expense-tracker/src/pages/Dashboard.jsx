import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExpenses, deleteExpense, getSpendingInsights } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: ""
  });
  
  // Colors for chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F27173', '#A173F2'];
  
  // Fetch expenses with pagination and filters
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await getExpenses(
        pagination.page, 
        pagination.limit, 
        filters
      );
      setExpenses(data.expenses);
      setPagination({
        ...pagination,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (err) {
      setError("Failed to fetch expenses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch spending insights
  const fetchInsights = async () => {
    try {
      const { data } = await getSpendingInsights(filters);
      setInsights(data.insights);
      setTotalSpending(data.totalSpending);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    }
  };
  
  // Load data on component mount and when filters or pagination change
  useEffect(() => {
    fetchExpenses();
    fetchInsights();
  }, [pagination.page, pagination.limit, filters]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    // Reset to first page when filters change
    setPagination({ ...pagination, page: 1 });
  };
  
  // Handle expense deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchExpenses(); // Refresh expenses
        fetchInsights(); // Refresh insights
      } catch (err) {
        setError("Failed to delete expense. Please try again.");
        console.error(err);
      }
    }
  };
  
  return (
    <div className="dashboard-container">
      <h2>Expenses Dashboard</h2>
      
      {/* Filters */}
      <div className="filters-container">
        <h3>Filters</h3>
        <div className="filters-form">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Housing">Housing</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilters({ startDate: "", endDate: "", category: "" });
              setPagination({ ...pagination, page: 1 });
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Insights Visualization */}
        <div className="insights-container">
          <h3>Spending Insights</h3>
          {insights.length > 0 ? (
            <>
              <div className="spending-summary">
                <p>Total Spending: ${totalSpending.toFixed(2)}</p>
              </div>
              <div className="insights-table">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.map((insight, index) => (
                      <tr key={index}>
                        <td>{insight.category}</td>
                        <td>${insight.total.toFixed(2)}</td>
                        <td>{insight.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No spending data available</p>
          )}
        </div>
        
        {/* Expenses Table */}
        <div className="expenses-container">
          <h3>Recent Expenses</h3>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Loading expenses...</p>
          ) : expenses.length > 0 ? (
            <>
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>${expense.amount.toFixed(2)}</td>
                      <td>{expense.category}</td>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>{expense.description || "-"}</td>
                      <td className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => navigate(`/edit-expense/${expense._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(expense._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination controls */}
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No expenses found. Add some expenses to get started!</p>
          )}
          <button
            className="btn btn-primary add-expense-btn"
            onClick={() => navigate('/add-expense')}
          >
            Add New Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
