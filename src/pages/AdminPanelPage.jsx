import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";
import UserCTX from "../context/UserContext";


const AdminDashboard = ({ handleLogout }) => {
  const userData = useContext(UserCTX); 
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("http://localhost:3000/logout", { credentials: "include" });
    userData.setUser(null);
    navigate("/");
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
