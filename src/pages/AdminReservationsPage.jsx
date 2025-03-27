"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserCTX from "../context/UserContext"
import styles from "./AdminReservationsPage.module.css"
import { FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa" // Added FaArrowLeft
import { API_BASE_URL } from '../api';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useContext(UserCTX)
  const navigate = useNavigate()

  // Added goBack function
  const goBack = () => {
    navigate(-1) // Navigate back to previous page
  }

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }

    const fetchReservations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/reservations`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch reservations")
        }
        const data = await response.json()
        setReservations(data)
      } catch (err) {
        console.error("Error fetching reservations:", err)
        setError("Failed to load reservations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [user, navigate])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reservations/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error("Failed to update reservation status")
      }
      setReservations(reservations.map((res) => (res._id === id ? { ...res, status: newStatus } : res)))
    } catch (err) {
      console.error("Error updating reservation status:", err)
      alert("Failed to update reservation status. Please try again.")
    }
  }

  // Sort reservations by date (newest first)
  const sortedReservations = [...reservations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((r) => r.status !== "cancelled")

  if (loading) return <div className={styles.loading}>Резервациите зареждат...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.adminReservationsContainer}>
      <h2>Управление на Резервациите</h2>
      <table className={styles.reservationsTable}>
        <thead>
          <tr>
            <th>Име</th>
            <th>Email</th>
            <th>Дата</th>
            <th>Час</th>
            <th>Брой хора</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {sortedReservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>{reservation.userId?.fullname}</td>
              <td>{reservation.userId?.email}</td>
              <td>{new Date(reservation.date).toLocaleDateString()}</td>
              <td>{reservation.startHour}:00</td>
              <td>{reservation.people}</td>
              <td>{reservation.status}</td>
              <td>
                <button
                  onClick={() => handleStatusChange(reservation._id, "confirmed")}
                  className={`${styles.actionButton} ${styles.confirmButton}`}
                  disabled={reservation.status === "confirmed"}
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => handleStatusChange(reservation._id, "cancelled")}
                  className={`${styles.actionButton} ${styles.cancelButton}`}
                  disabled={reservation.status === "cancelled"}
                >
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back button */}
      <button className={styles.backButton} onClick={goBack} aria-label="Go back">
        <FaArrowLeft />
      </button>
    </div>
  )
}

export default AdminReservationsPage

