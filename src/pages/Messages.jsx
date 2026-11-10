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
        const sortedMessages = data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

        setMessages(sortedMessages)
      } catch (err) {
        console.error("Error fetching messages:", err)
        setError("Съобщенията не могат да бъдат заредени. Опитайте отново по-късно.")
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
        alert("Резервацията не може да бъде отказана. Опитайте отново по-късно.")
      }
    }
  }

  const handleDismissMessage = async (messageId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, { method: "DELETE", credentials: "include" })
    if (response.ok) setMessages((previous) => previous.filter((msg) => msg._id !== messageId))
    else alert("Неуспешно изтриване на съобщението")
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
        alert("Задачата не може да бъде отбелязана като изпълнена. Опитайте отново по-късно.")
      }
    }
  }

  // Parse reservation details from content
  const parseReservationDetails = (content) => {
    
    const details = {
      date: "",
      hour: "",
      people: "",
      status: "pending", 
    }

    try {
      // Check status 
      if (content.includes("cancelled") || content.includes("отказана") || content.includes("отхвърлена")) {
        details.status = "rejected"
      } else if (content.includes("confirmed") || content.includes("потвърдена") || content.includes("одобрена")) {
        details.status = "confirmed"
      }

      // Extract people
      const peopleMatch = content.match(/(\d+)\s+People|(\d+)\s+човека?/i)
      if (peopleMatch) {
        details.people = peopleMatch[1] || peopleMatch[2]
      }

      // Extract date - looking for a date format like YYYY-MM-DD
      const dateMatch = content.match(/Date:\s*(\d{4}-\d{2}-\d{2})|(\d{4}-\d{2}-\d{2})/i)
      if (dateMatch) {
        details.date = dateMatch[1] || dateMatch[2]
      }

      // Extract hour
      const hourMatch = content.match(/Hour:\s*(\d{1,2}):00|(\d{1,2}):00/i)
      if (hourMatch) {
        details.hour = hourMatch[1] || hourMatch[2]
      }
    } catch (err) {
      console.error("Error parsing reservation details:", err)
    }

    return details
  }

  // Parse task details from content
  const parseTaskDetails = (content, deadline) => {
    // Extract description and deadline from content
    const lines = content.split("\n\n")
    const description = lines[0]

    return {
      description,
      deadline: deadline || null,
    }
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

  const head = (
    <header className="page-head">
      <h1 className="page-title">Вашите съобщения</h1>
      <p className="page-lede">Отговори на резервации и съобщения от ресторанта.</p>
    </header>
  )

  if (loading) return <div className="page page--narrow">{head}<p className="loader" role="status">Зареждане на съобщенията…</p></div>
  if (error) return <div className="page page--narrow">{head}<p className="notice notice--error" role="alert"><FaExclamationTriangle aria-hidden="true" /> {error}</p></div>

  return (
    <div className={`page page--narrow ${styles.messagesContainer}`}>
      {head}
      {messages.length === 0 ? (
        <div className="state">
          <strong>Нямате съобщения.</strong>
          <span>Тук ще получите отговор, когато изпратите запитване за резервация.</span>
          <button type="button" className="btn btn--primary" onClick={() => navigate("/reservations")}>Запазете маса</button>
        </div>
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
                ? parseTaskDetails(message.content, message.deadline)
                : { description: "", deadline: null }

            const deadlinePassed = isDeadlinePassed(message.deadline)

            return (
              <li key={message._id} className={styles.messageItem}>
                <div className={styles.messageHeader}>
                  <div className={styles.userContainer}>
                    <img src={message.sender?.photo || "/placeholder.svg"} alt="" />
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{message.sender?.fullname || "Администратор"}</p>
                      <p className={`${styles.messageTitle} ${message.type === "reservation" ? (reservationDetails.status === "rejected" ? styles.titleBad : "") : ""}`}>
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
                    className={`btn btn--ghost btn--icon ${styles.dismissButton}`}
                    aria-label="Изтрий съобщението"
                  >
                    <FaTimes />
                  </button>
                </div>

                {message.type === "reservation" ? (
                  <div className={styles.reservationDetails}>
                    {reservationDetails.status === "rejected" ? (
                      <div className={styles.rejectedMessage}>
                        <FaExclamationTriangle className={styles.rejectionIcon} />
                        <div>
                          <p className={styles.rejectionTitle}>Скъпи гост,</p>
                          <p>
                            С искрено съжаление Ви информираме, че не можем да потвърдим Вашата резервация за желаната
                            дата и час. Молим за разбиране!
                          </p>
                          <p>
                            Бихме искали да Ви предложим да се свържете с нас по телефона, за да Ви помогнем да намерите
                            друго подходящо време за Вашето посещение. Ще бъдем щастливи да Ви посрещнем в нашия
                            ресторант.
                          </p>
                          <p>Благодарим Ви за интереса и се надяваме скоро да имаме удоволствието да Ви посрещнем!</p>
                        </div>
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

                    {reservationDetails.status !== "rejected" ? (
                      <p className={styles.additionalInfo}>
                        Очакваме Ви! Ако имате въпроси или желаете да промените резервацията си, моля свържете се с нас.
                      </p>
                    ) : (
                      <p className={styles.additionalInfo}>
                        Вашето удовлетворение е наш приоритет. Винаги сме на разположение да Ви помогнем с алтернативна
                        резервация, която да отговаря на Вашите предпочитания.
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
                      <p>{taskDetails.description}</p>
                    </div>

                    <div className={styles.taskInfo}>
                      <div className={styles.infoItem}>
                        <FaCalendarAlt className={styles.infoIcon} />
                        <span>Краен срок: {formatDate(message.deadline)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaClock className={styles.infoIcon} />
                        <span>Час: {formatTime(message.deadline)}</span>
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
                      className="btn btn--danger btn--small"
                    >
                      <FaTimesCircle /> Откажете резервация
                    </button>
                    <button onClick={() => navigate("/contact")} className="btn btn--ghost btn--small">
                      <FaPhoneAlt /> Свържете се с нас
                    </button>
                  </div>
                )}

                {message.type === "task" && message.status !== "completed" && (
                  <div className={styles.taskActions}>
                    <button onClick={() => handleCompleteTask(message._id)} className="btn btn--primary btn--small">
                      <FaCheckCircle /> Маркирай като изпълнена
                    </button>
                    <button onClick={() => navigate("/contact")} className="btn btn--ghost btn--small">
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

