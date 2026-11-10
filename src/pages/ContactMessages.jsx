import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa"
import UserCTX from "../context/UserContext"
import { API_BASE_URL } from "../api"
import styles from "./ContactMessages.module.css"

export default function ContactMessages() {
  const { user } = useContext(UserCTX)
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.role !== "admin") { navigate("/"); return }
    fetch(`${API_BASE_URL}/admin/contact-messages`, { credentials: "include" })
      .then((response) => { if (!response.ok) throw new Error("Неуспешно зареждане"); return response.json() })
      .then(setMessages).catch((err) => setError(err.message))
  }, [user, navigate])

  return <div className="page page--narrow">
    <button className="back-link" onClick={() => navigate(-1)}><FaArrowLeft aria-hidden="true" /> Назад</button>
    <header className="page-head">
      <h1 className="page-title">Съобщения от контактната форма</h1>
      {!error && messages.length > 0 && <p className="page-lede">{messages.length} съобщения</p>}
    </header>
    {error && <p className="notice notice--error" role="alert"><FaExclamationTriangle aria-hidden="true" /> {error}</p>}
    {!error && messages.length === 0 && <div className="state"><strong>Няма съобщения.</strong><span>Съобщенията от страница „Връзка с нас“ ще се появят тук.</span></div>}
    <ul className={styles.list}>{messages.map((entry) =>
      <li className={styles.item} key={entry._id}>
        <div className={styles.meta}>
          <strong className={styles.name}>{entry.name}</strong>
          <a href={`mailto:${entry.email}`} className={styles.email}>{entry.email}</a>
          <time className={styles.date} dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString("bg-BG")}</time>
        </div>
        <p className={styles.message}>{entry.message}</p>
      </li>)}</ul>
  </div>
}
