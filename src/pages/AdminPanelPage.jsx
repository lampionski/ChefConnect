import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";
import UserCTX from "../context/UserContext";
import { FaUtensils, FaCalendarAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const userData = useContext(UserCTX);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch("http://localhost:3000/logout", { credentials: "include" });
    userData.setUser(null);
    navigate("/");
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.content}>
        <h1 className={styles.title}>Админ Панел</h1>
        <p className={styles.welcome}>Добре дошли, {userData.user?.fullname || 'Администратор'}!</p>
        <div className={styles.dashboardOptions}>
          <button onClick={() => navigate("/manage-menu")} className={styles.option}>
            <FaUtensils className={styles.icon} />
            <span>Управление на Меню</span>
          </button>
          <button onClick={() => navigate("/admin/reservations")} className={styles.option}>
            <FaCalendarAlt className={styles.icon} />
            <span>Управление на Резервации</span>
          </button>
          <button onClick={() => navigate("/admin/manage-users")} className={styles.option}>
            <FaUsers className={styles.icon} />
            <span>Управление на Потребители</span>
          </button>
        </div>
        <button onClick={logout} className={styles.logout}>
          <FaSignOutAlt className={styles.icon} />
          <span>Излезте от Профил</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
