import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpenseById, updateExpense } from '../api';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    date: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const { data } = await getExpenseById(id);
        // Format date to YYYY-MM-DD for input field
        const formattedDate = new Date(data.date).toISOString().split('T')[0];
        setExpense({
          ...data,
          date: formattedDate
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch expense');
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({
      ...expense,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(id, expense);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-expense-container">
      <h2>Edit Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
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
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={expense.description || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Expense</button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditExpense; 