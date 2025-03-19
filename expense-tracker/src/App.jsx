import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Navbar from "./components/Navbar";
import { getCurrentUser } from "./api"; // Import API helper
import { refreshToken } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data);
      } catch (error) {
        // If token is expired, try to refresh
        if (error.response?.status === 401 && error.response?.data?.expired) {
          try {
            await refreshToken();
            const { data } = await getCurrentUser();
            setUser(data);
          } catch (refreshError) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // While checking authentication status, show loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/add-expense" element={user ? <AddExpense /> : <Navigate to="/login" />} />
          <Route path="/edit-expense/:id" element={user ? <EditExpense /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
