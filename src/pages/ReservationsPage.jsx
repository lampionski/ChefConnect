"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import ReservationForm from "../components/ReservationForm"
import UserCTX from "../context/UserContext"
import styles from "./ReservationsPage.module.css"

function ReservationInfo() {
  return (
    <aside className={styles.info} aria-label="Как работи резервацията">
      <h2 className={styles.infoTitle}>Как работи</h2>
      <ol className={styles.steps}>
        <li>
          <strong>Изберете дата, час и брой гости.</strong>
          <span>Приемаме резервации на кръгъл час между 10:00 и 21:00, поне 4 часа предварително, за 1 до 20 души.</span>
        </li>
        <li>
          <strong>Изпратете запитването.</strong>
          <span>Екипът ни проверява свободните маси.</span>
        </li>
        <li>
          <strong>Получавате отговор в „Съобщения“.</strong>
          <span>Там можете и да откажете резервацията, ако плановете ви се променят.</span>
        </li>
      </ol>
      <p className={styles.phone}>
        Предпочитате телефон? <a href="tel:+1234567890">+123 456 7890</a>
      </p>
    </aside>
  )
}

export default function ReservationsPage() {
  const { user } = useContext(UserCTX)
  const navigate = useNavigate()

  return (
    <div className={`page ${styles.container}`}>
      <header className="page-head">
        <h1 className="page-title">Запазете маса</h1>
        <p className="page-lede">Изпратете запитване онлайн и ще ви потвърдим резервацията в профила ви.</p>
      </header>

      <div className={styles.layout}>
        <ReservationInfo />
        <div className={styles.formContainer}>
          {!user ? (
            <div className={styles.signedOut}>
              <h2 className={styles.formTitle}>Моля влезте в акаунта си, за да направите резервация</h2>
              <p>Резервациите и отговорите към тях се пазят във вашия профил.</p>
              <button className="btn btn--primary" onClick={() => navigate("/signin")}>
                Вход / Създайте акаунт
              </button>
            </div>
          ) : (
            <ReservationForm />
          )}
        </div>
      </div>
    </div>
  )
}
