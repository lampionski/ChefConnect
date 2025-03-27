"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../pages/ReservationsPage.module.css"
import { FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa"
import { API_BASE_URL } from '../api';

export default function ReservationForm({ userId }) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("12:00") // Changed from hour to time
  const [people, setPeople] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [minDate, setMinDate] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Set minimum date to 4 hours from now
    const now = new Date()
    now.setHours(now.getHours() + 4)
    setMinDate(now.toISOString().split("T")[0])
  }, [])

  const validateForm = () => {
    if (!date || !time || !people) {
      setError("Моля, попълнете всички полета")
      return false
    }

    // Extract hour from time string
    const hour = Number.parseInt(time.split(":")[0], 10)

    // Validate hour (between 10 and 21)
    if (hour < 10 || hour > 21) {
      setError("Часът трябва да бъде между 10:00 и 21:00")
      return false
    }

    // Validate reservation time (at least 4 hours from now)
    const selectedDate = new Date(date)
    const [hours, minutes] = time.split(":").map(Number)
    const selectedTime = new Date(date)
    selectedTime.setHours(hours, minutes, 0, 0)

    const now = new Date()
    now.setHours(now.getHours() + 4)

    if (selectedTime < now) {
      setError("Резервацията трябва да бъде поне 4 часа от сега")
      return false
    }

    // Validate number of people (between 1 and 20)
    const peopleNum = Number.parseInt(people, 10)
    if (peopleNum < 1 || peopleNum > 20) {
      setError("Броят на гостите трябва да бъде между 1 и 20")
      return false
    }

    return true
  }

  const handleReservationRequest = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // Extract hour from time string (e.g., "14:30" -> 14)
      const hour = Number.parseInt(time.split(":")[0], 10)

      const response = await fetch(`${API_BASE_URL}/reservation-request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date,
          startHour: hour,
          people: Number.parseInt(people, 10),
        }),
      })

      if (response.ok) {
        alert("Заявката за резервация е изпратена успешно! Проверете съобщенията си за потвърждение.")
        navigate("/")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Неуспешно изпращане на заявка за резервация")
      }
    } catch (err) {
      console.error("Неуспешно изпращане на заявка за резервация", err)
      setError(err.message || "Неуспешно изпращане на заявка за резервация. Моля, опитайте отново.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className={styles.formTitle}>Запитване за Резервация</h2>
      <div className={styles.formGroup}>
        <label htmlFor="date">
          <FaCalendarAlt className={styles.inputIcon} /> Дата:
        </label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} min={minDate} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="time">
          <FaClock className={styles.inputIcon} /> Час (10:00 - 21:00):
        </label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          min="10:00"
          max="21:00"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="people">
          <FaUsers className={styles.inputIcon} /> Брой хора (1-20):
        </label>
        <input
          type="number"
          id="people"
          min="1"
          max="20"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          required
        />
      </div>
      <button onClick={handleReservationRequest} className={styles.reserveButton} disabled={loading}>
        {loading ? "Изпращане..." : "Изпратете запитване за резервация"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </>
  )
}

