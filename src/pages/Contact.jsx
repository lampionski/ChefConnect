"use client"

import styles from "./Contact.module.css"
import Swal from "sweetalert2"
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa"
import { API_BASE_URL } from "../api"

const swalTheme = {
  confirmButtonColor: "#c8321a",
  customClass: { popup: "cc-swal" },
}

const Contact = () => {
  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    const object = Object.fromEntries(formData)
    const json = JSON.stringify(object)

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      })

      if (response.ok) {
        Swal.fire({
          title: "Успешно!",
          text: "Вашето съобщение беше запазено локално и е видимо за администратора",
          icon: "success",
          ...swalTheme,
        }).then(() => {
          event.target.reset()
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch {
      Swal.fire({
        title: "Грешка!",
        text: "Възникна проблем при изпращането на съобщението. Моля, опитайте отново.",
        icon: "error",
        ...swalTheme,
      })
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Свържете се с нас</h1>
        <p className="page-lede">
          Имате въпроси? Не се колебайте да се свържете с нас. Нашият екип ще ви отговори възможно най-скоро.
        </p>
      </header>

      <div className={styles.contactWrapper}>
        <div className={styles.contactInfo}>
          <dl className={styles.infoList}>
            <div className={styles.infoItem}>
              <dt><FaPhoneAlt className={styles.infoIcon} aria-hidden="true" /> Телефон</dt>
              <dd>
                <a href="tel:+1234567890">+123 456 7890</a>
              </dd>
            </div>

            <div className={styles.infoItem}>
              <dt><FaEnvelope className={styles.infoIcon} aria-hidden="true" /> Имейл</dt>
              <dd>
                <a href="mailto:info@chefconnect.com">info@chefconnect.com</a>
              </dd>
            </div>

            <div className={styles.infoItem}>
              <dt><FaMapMarkerAlt className={styles.infoIcon} aria-hidden="true" /> Адрес</dt>
              <dd>бул. Княз Борис I 66, Варна</dd>
            </div>

            <div className={styles.infoItem}>
              <dt><FaClock className={styles.infoIcon} aria-hidden="true" /> Работно време</dt>
              <dd>
                Пон – Пет: 10:00 – 22:00
                <br />
                Съб – Нед: 11:00 – 23:00
              </dd>
            </div>
          </dl>
        </div>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Изпратете съобщение</h2>
          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className="field">
                <label htmlFor="contact-name" className="field-label">Вашето име</label>
                <input id="contact-name" type="text" name="name" autoComplete="name" required />
              </div>

              <div className="field">
                <label htmlFor="contact-email" className="field-label">Вашият имейл</label>
                <input id="contact-email" type="email" name="email" autoComplete="email" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="contact-message" className="field-label">Вашето съобщение</label>
              <textarea id="contact-message" name="message" required></textarea>
            </div>

            <button type="submit" className={`btn btn--primary ${styles.submitButton}`}>
              Изпратете съобщение
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
