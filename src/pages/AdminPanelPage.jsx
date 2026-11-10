"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./AdminPanel.module.css"
import UserCTX from "../context/UserContext"
import { FaUtensils, FaCalendarAlt, FaUsers, FaSignOutAlt, FaUserTie, FaInbox, FaArrowRight } from "react-icons/fa"
import { API_BASE_URL } from '../api';

const options = [
  { to: "/admin/reservations", icon: FaCalendarAlt, label: "Управление на резервации", hint: "Потвърждавайте и отказвайте запитвания" },
  { to: "/manage-menu", icon: FaUtensils, label: "Управление на меню", hint: "Добавяйте, редактирайте и изтривайте ястия" },
  { to: "/admin/manage-users", icon: FaUsers, label: "Управление на потребители", hint: "Роли и данни на акаунтите" },
  { to: "/admin/manage-workers", icon: FaUserTie, label: "Управление на работници", hint: "Възлагайте задачи и следете сроковете" },
  { to: "/admin/contact-messages", icon: FaInbox, label: "Съобщения от контактната форма", hint: "Въпроси от посетители на сайта" },
]

const AdminDashboard = () => {
  const userData = useContext(UserCTX)
  const navigate = useNavigate()

  const logout = async () => {
    await fetch(`${API_BASE_URL}/logout`, { method: "POST", credentials: "include" })
    window.location.replace("/")
  }

  if (userData.user?.role !== "admin")
    return (
      <div className="page page--narrow">
        <p className="notice notice--error" role="alert">Нямате достъп до тази страница.</p>
      </div>
    )

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Админ панел</h1>
        <p className="page-lede">Добре дошли, {userData.user?.fullname || "Администратор"}!</p>
      </header>
      <div className={styles.dashboardOptions}>
        {options.map(({ to, icon: Icon, label, hint }) => (
          <button key={to} onClick={() => navigate(to)} className={styles.option}>
            <Icon className={styles.icon} aria-hidden="true" />
            <span className={styles.optionText}>
              <span className={styles.optionLabel}>{label}</span>
              <span className={styles.optionHint}>{hint}</span>
            </span>
            <FaArrowRight className={styles.arrow} aria-hidden="true" />
          </button>
        ))}
      </div>
      <button onClick={logout} className={`btn btn--ghost ${styles.logout}`}>
        <FaSignOutAlt aria-hidden="true" />
        <span>Излезте от профила</span>
      </button>
    </div>
  )
}

export default AdminDashboard
