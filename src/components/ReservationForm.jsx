"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../pages/ReservationsPage.module.css"

export default function ReservationForm({ userId }) {
  const [date, setDate] = useState("")
  const [hour, setHour] = useState("")
  const [people, setPeople] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleReservationRequest = async () => {
    if (!date || !hour || !people) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:3000/reservation-request", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date,
          startHour: hour,
          people,
        }),
      })

      if (response.ok) {
        alert("Reservation request sent successfully! Check your messages for confirmation.")
        navigate("/messages")
      } else {
        throw new Error("Failed to send reservation request")
      }
    } catch (err) {
      console.error("Failed to send reservation request", err)
      setError("Failed to send reservation request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Request a Reservation</h2>
      <div className={styles.formGroup}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="hour">Hour:</label>
        <input type="number" id="hour" min="0" max="23" value={hour} onChange={(e) => setHour(e.target.value)} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="people">People:</label>
        <input type="number" id="people" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
      </div>
      <button onClick={handleReservationRequest} className={styles.reserveButton} disabled={loading}>
        {loading ? "Sending Request..." : "Send Reservation Request"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

