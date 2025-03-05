"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserCTX from "../context/UserContext"
import styles from "./Messages.module.css"

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useContext(UserCTX)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/signin")
      return
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/messages`, { credentials: 'include' })
        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }
        const data = await response.json()
        setMessages(data)
      } catch (err) {
        console.error("Error fetching messages:", err)
        setError("Failed to load messages. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [user, navigate])

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        const response = await fetch(`http://localhost:3000/user/reservations/${reservationId}/cancel`, {
          method: "PUT",
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error("Failed to cancel reservation")
        }
        // Remove the cancelled reservation message from the list
        setMessages(messages.filter((msg) => msg.reservationId !== reservationId))
      } catch (err) {
        console.error("Error cancelling reservation:", err)
        alert("Failed to cancel reservation. Please try again later.")
      }
    }
  }

  if (loading) return <div className={styles.loading}>Loading messages...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.messagesContainer}>
      <h2>Your Messages</h2>
      {messages.length === 0 ? (
        <p>You have no messages.</p>
      ) : (
        <ul className={styles.messageList}>
          {messages.map((message) => (
            <li key={message._id} className={styles.messageItem}>
              <div className={styles.userContainer}>
                <img src={message.sender.photo} />
                <p>{message.sender.fullname} - {message.title}</p>
              </div>
              <p>{message.content}</p>
              {message.type === "reservation" && (
                <div className={styles.reservationActions}>
                  <button onClick={() => handleCancelReservation(message.reservationId)}>Cancel Reservation</button>
                  <button onClick={() => navigate("/contact")}>Contact Us</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

