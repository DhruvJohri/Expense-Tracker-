import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Expense Tracker</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          // Authenticated user menu
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add-expense">Add Expense</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <span className="user-greeting">
              Welcome, {user.firstName}!
            </span>
          </>
        ) : (
          // Unauthenticated user menu
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
