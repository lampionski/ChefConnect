"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserCTX from "../context/UserContext"
import styles from "./Messages.module.css"
import {
  FaTimesCircle,
  FaPhoneAlt,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaHourglassHalf,
  FaCheckCircle,
} from "react-icons/fa"
import { API_BASE_URL } from '../api';

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
        const response = await fetch(`${API_BASE_URL}/messages`, { credentials: "include" })
        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }
        const data = await response.json()
        // Sort messages to show newest first (assuming messages have a createdAt field)
        // If there's no createdAt field, we'll reverse the array assuming newest are at the end
        const sortedMessages = data
          .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt)
            }
            return 0 // Keep original order if no date field
          })
          .reverse() // Reverse the array to show newest first

        setMessages(sortedMessages)
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
    if (window.confirm("Сигурен ли сте, че искате да откажете резервацията?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/user/reservations/${reservationId}/cancel`, {
          method: "PUT",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to cancel reservation")
        }
        setMessages(messages.filter((msg) => msg.reservationId !== reservationId))
      } catch (err) {
        console.error("Error cancelling reservation:", err)
        alert("Failed to cancel reservation. Please try again later.")
      }
    }
  }

  const handleDismissMessage = (messageId) => {
    setMessages(messages.filter((msg) => msg._id !== messageId))
  }

  const handleCompleteTask = async (messageId) => {
    if (window.confirm("Потвърдете, че задачата е изпълнена")) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${messageId}/complete`, {
          method: "PUT",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to mark task as completed")
        }

        // Update the task status locally
        setMessages(messages.map((msg) => (msg._id === messageId ? { ...msg, status: "completed" } : msg)))
      } catch (err) {
        console.error("Error completing task:", err)
        alert("Failed to mark task as completed. Please try again later.")
      }
    }
  }

  // Parse reservation details from content
  const parseReservationDetails = (content) => {
    // This is a simple parser assuming content is in a specific format
    const details = {
      date: "",
      hour: "",
      people: "",
      status: "pending", // Default status
    }

    try {
      // Extract people
      const peopleMatch = content.match(/(\d+)\s+People?/i)
      if (peopleMatch) {
        details.people = peopleMatch[1]
      }

      // Extract date - looking for a date format like YYYY-MM-DD
      const dateMatch = content.match(/(\d{4}-\d{2}-\d{2})/i)
      if (dateMatch) {
        details.date = dateMatch[1]
      }

      // Extract hour
      const hourMatch = content.match(/(\d{1,2}):00/i)
      if (hourMatch) {
        details.hour = hourMatch[1]
      }

      // Check status
      if (content.includes("потвърдена") || content.includes("одобрена")) {
        details.status = "confirmed"
      } else if (content.includes("отказана") || content.includes("отхвърлена")) {
        details.status = "rejected"
      }
    } catch (err) {
      console.error("Error parsing reservation details:", err)
    }

    return details
  }

  const parseTaskDetails = ({title, content}) => {
    // This is a simple parser assuming content is in a specific format
    const details = {
      title,
      deadline: "",
      status: "pending", // Default status
    }

    try {

      // Extract date - looking for a date format like YYYY-MM-DD
      const dateMatch = content.match(/(\d{4}-\d{2}-\d{2})/i)
      if (dateMatch) {
        details.date = dateMatch[1]
      }

      // Extract hour
      const hourMatch = content.match(/(\d{1,2}):00/i)
      if (hourMatch) {
        details.hour = hourMatch[1]
      }

      details.deadline = `${dateMatch?.[1]} ${hourMatch?.[1]}:00`;

      // Check status
      if (content.includes("потвърдена") || content.includes("одобрена")) {
        details.status = "confirmed"
      } else if (content.includes("отказана") || content.includes("отхвърлена")) {
        details.status = "rejected"
      }
    } catch (err) {
      console.error("Error parsing reservation details:", err)
    }

    return details
  }

  // Format date to Bulgarian format
  const formatDate = (dateString) => {
    if (!dateString) return "Не е посочена"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Не е посочена"

      return date.toLocaleDateString("bg-BG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    } catch (err) {
      console.error("Error formatting date:", err)
      return "Не е посочена"
    }
  }

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ""

      return date.toLocaleTimeString("bg-BG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (err) {
      console.error("Error formatting time:", err)
      return ""
    }
  }

  // Check if a deadline is in the past
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false

    const deadlineDate = new Date(deadline)
    const now = new Date()

    return deadlineDate < now
  }

  if (loading) return <div className={styles.loading}>Зареждане на съобщенията...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.messagesContainer}>
      <h2>Вашите съобщения</h2>
      {messages.length === 0 ? (
        <p className={styles.noMessages}>Нямате съобщения.</p>
      ) : (
        <ul className={styles.messageList}>
          {messages.map((message) => {
            // Parse reservation details from content if it's a reservation
            const reservationDetails =
              message.type === "reservation"
                ? parseReservationDetails(message.content)
                : { date: "", hour: "", people: "", status: "" }

            // Parse task details if it's a task
            const taskDetails =
              message.type === "task"
                ? parseTaskDetails(message)
                : { description: "", deadline: null }

            const deadlinePassed = isDeadlinePassed(message.deadline)

            return (
              <li key={message._id} className={styles.messageItem}>
                <div className={styles.messageHeader}>
                  <div className={styles.userContainer}>
                    <img src={message.sender?.photo || "/placeholder.svg"} alt={message.sender?.fullname} />
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{message.sender?.fullname}</p>
                      <p className={styles.messageTitle}>
                        {message.type === "reservation"
                          ? reservationDetails.status === "rejected"
                            ? "Отказана резервация"
                            : "Потвърждение на резервация"
                          : message.type === "task"
                            ? "Възложена задача"
                            : message.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismissMessage(message._id)}
                    className={styles.dismissButton}
                    aria-label="Dismiss message"
                  >
                    <FaTimes />
                  </button>
                </div>

                {message.type === "reservation" ? (
                  <div className={styles.reservationDetails}>
                    {reservationDetails.status === "rejected" ? (
                      <div className={styles.rejectedMessage}>
                        <FaExclamationTriangle className={styles.rejectionIcon} />
                        <p>
                          Съжаляваме, но Вашата заявка за резервация не може да бъде потвърдена. Моля, свържете се с нас
                          за повече информация или опитайте с друга дата или час.
                        </p>
                      </div>
                    ) : (
                      <p className={styles.welcomeMessage}>
                        Здравейте! Благодарим Ви, че избрахте нашия ресторант. Вашата резервация е потвърдена със
                        следните детайли:
                      </p>
                    )}

                    <div className={styles.reservationInfo}>
                      <div className={styles.infoItem}>
                        <FaCalendarAlt className={styles.infoIcon} />
                        <span>Дата: {formatDate(reservationDetails.date)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaClock className={styles.infoIcon} />
                        <span>
                          Час: {reservationDetails.hour ? `${reservationDetails.hour}:00 ч.` : "Не е посочен"}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaUsers className={styles.infoIcon} />
                        <span>
                          Брой гости: {reservationDetails.people || "Не е посочен"}
                          {reservationDetails.people && (reservationDetails.people === "1" ? " човек" : " човека")}
                        </span>
                      </div>
                    </div>

                    {reservationDetails.status !== "rejected" && (
                      <p className={styles.additionalInfo}>
                        Очакваме Ви! Ако имате въпроси или желаете да промените резервацията си, моля свържете се с нас.
                      </p>
                    )}
                  </div>
                ) : message.type === "task" ? (
                  <div className={styles.taskDetails}>
                    <div className={deadlinePassed ? styles.taskOverdue : styles.taskActive}>
                      {deadlinePassed ? (
                        <FaExclamationTriangle className={styles.taskIcon} />
                      ) : (
                        <FaClipboardCheck className={styles.taskIcon} />
                      )}
                      <p>
                        {deadlinePassed
                          ? "Внимание! Крайният срок за тази задача е изтекъл."
                          : "Възложена Ви е нова задача със следните детайли:"}
                      </p>
                    </div>

                    <div className={styles.taskDescription}>
                      <p>{taskDetails.title}</p>
                    </div>

                    <div className={styles.taskInfo}>
                      <div className={styles.infoItem}>
                        <FaCalendarAlt className={styles.infoIcon} />
                        <span>Краен срок: {formatDate(taskDetails.deadline)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaClock className={styles.infoIcon} />
                        <span>Час: {formatTime(taskDetails.deadline)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaHourglassHalf className={styles.infoIcon} />
                        <span>
                          Статус:{" "}
                          {message.status === "completed" ? "Изпълнена" : deadlinePassed ? "Просрочена" : "Активна"}
                        </span>
                      </div>
                    </div>

                    <p className={styles.additionalInfo}>
                      Моля, изпълнете задачата в посочения срок и маркирайте като изпълнена, когато приключите.
                    </p>
                  </div>
                ) : (
                  <p className={styles.messageContent}>{message.content}</p>
                )}

                {message.type === "reservation" && reservationDetails.status !== "rejected" && (
                  <div className={styles.reservationActions}>
                    <button
                      onClick={() => handleCancelReservation(message.reservationId)}
                      className={styles.cancelButton}
                    >
                      <FaTimesCircle /> Откажете резервация
                    </button>
                    <button onClick={() => navigate("/contact")} className={styles.contactButton}>
                      <FaPhoneAlt /> Свържете се с нас
                    </button>
                  </div>
                )}

                {message.type === "task" && message.status !== "completed" && (
                  <div className={styles.taskActions}>
                    <button onClick={() => handleCompleteTask(message._id)} className={styles.completeButton}>
                      <FaCheckCircle /> Маркирай като изпълнена
                    </button>
                    <button onClick={() => navigate("/contact")} className={styles.contactButton}>
                      <FaPhoneAlt /> Свържете се с нас
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

