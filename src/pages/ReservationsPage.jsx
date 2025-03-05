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
        <h2>Please log in to make a reservation</h2>
        <button className={styles.loginButton} onClick={() => navigate("/signin")}>
          Log In / Create Account
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ReservationForm userId={user._id} />
    </div>
  )
}

