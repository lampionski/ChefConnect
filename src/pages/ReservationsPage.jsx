"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import ReservationForm from "../components/ReservationForm"
import UserCTX from "../context/UserContext"
import styles from "./ReservationsPage.module.css"

export default function ReservationsPage() {
  const { user } = useContext(UserCTX)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Моля влезте в акаунта си, за да направите резервация</h2>
          <button className={styles.loginButton} onClick={() => navigate("/signin")}>
            Вход / Създайте акаунт
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Направете резервация</h2>
        <ReservationForm userId={user._id} />
      </div>
    </div>
  )
}

