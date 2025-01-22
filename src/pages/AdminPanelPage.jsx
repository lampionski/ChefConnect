import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";

const AdminDashboard = ({ handleLogout }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <h2>Welcome to the Admin Dashboard</h2>
      <div className={styles.dashboardOptions}>
        <button onClick={() => navigate("/manage-menu")}>Manage Menu</button>
        <button onClick={() => navigate("/admin/reservations")}>
          Manage Reservations
        </button>
        <button onClick={logout} className={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
