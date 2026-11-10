"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserCTX from "../context/UserContext"
import styles from "./AdminReservationsPage.module.css"
import { FaCheck, FaTimes, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa"
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
        setError("Резервациите не могат да бъдат заредени. Опитайте отново по-късно.")
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
      alert("Статусът не може да бъде променен. Опитайте отново.")
    }
  }

  // Sort reservations by date (newest first)
  const sortedReservations = [...reservations]
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const statusLabel = { pending: "Чака отговор", confirmed: "Потвърдена", cancelled: "Отказана" }
  const statusTag = { pending: "tag tag--pending", confirmed: "tag tag--ok", cancelled: "tag tag--bad" }
  const pendingCount = reservations.filter((r) => r.status === "pending").length

  const head = (
    <>
      <button className="back-link" onClick={goBack}>
        <FaArrowLeft aria-hidden="true" /> Назад
      </button>
      <header className="page-head">
        <h1 className="page-title">Управление на резервациите</h1>
        {!loading && !error && (
          <p className="page-lede">
            {reservations.length} резервации · {pendingCount} чакат отговор
          </p>
        )}
      </header>
    </>
  )

  if (loading) return <div className="page">{head}<p className="loader" role="status">Резервациите зареждат…</p></div>
  if (error) return <div className="page">{head}<p className="notice notice--error" role="alert"><FaExclamationTriangle aria-hidden="true" /> {error}</p></div>

  return (
    <div className={`page ${styles.adminReservationsContainer}`}>
      {head}
      {sortedReservations.length === 0 ? (
        <div className="state">
          <strong>Все още няма резервации.</strong>
          <span>Новите запитвания от гостите ще се появят тук.</span>
        </div>
      ) : (
      <div className="table-wrap">
      <table className="data-table data-table--stack">
        <thead>
          <tr>
            <th scope="col">Име</th>
            <th scope="col">Имейл</th>
            <th scope="col">Дата</th>
            <th scope="col">Час</th>
            <th scope="col">Гости</th>
            <th scope="col">Статус</th>
            <th scope="col">Действие</th>
          </tr>
        </thead>
        <tbody>
          {sortedReservations.map((reservation) => (
            <tr key={reservation._id} className={reservation.status === "pending" ? styles.pendingRow : ""}>
              <td data-label="Име" className={styles.name}>{reservation.userId?.fullname}</td>
              <td data-label="Имейл" className={styles.email}>{reservation.userId?.email}</td>
              <td data-label="Дата">{new Date(reservation.date).toLocaleDateString("bg-BG")}</td>
              <td data-label="Час">{reservation.startHour}:00</td>
              <td data-label="Гости">{reservation.people}</td>
              <td data-label="Статус">
                <span className={statusTag[reservation.status] || "tag"}>{statusLabel[reservation.status] || reservation.status}</span>
              </td>
              <td data-label="Действие">
                <div className="row-actions">
                <button
                  onClick={() => handleStatusChange(reservation._id, "confirmed")}
                  className="btn btn--small"
                  disabled={reservation.status !== "pending"}
                >
                  <FaCheck aria-hidden="true" /> Потвърди
                </button>
                <button
                  onClick={() => handleStatusChange(reservation._id, "cancelled")}
                  className="btn btn--danger btn--small"
                  disabled={reservation.status === "cancelled"}
                >
                  <FaTimes aria-hidden="true" /> Откажи
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
    </div>
  )
}

export default AdminReservationsPage

