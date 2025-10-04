import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-logo">
        <Link to="/">📝 MyBlog</Link>
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/create">Write</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>

      <div className="nav-auth">
        {user ? (
          <>
            <span className="user-info">
              👤 {user.name} <span className="role">({user.role})</span>
            </span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="auth-link" to="/login">
              Login
            </Link>
            <Link className="auth-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
