"use client"

import styles from "./Contact.module.css"
import Swal from "sweetalert2"
import { FaUser, FaEnvelope, FaCommentAlt, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa"
import Footer from "../components/Footer" // Import the Footer component

const Contact = () => {
  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    formData.append("access_key", "f80f01ba-c73c-47cd-814a-e3473041d96a")

    const object = Object.fromEntries(formData)
    const json = JSON.stringify(object)

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json())

      if (res.success) {
        Swal.fire({
          title: "Успешно!",
          text: "Вашето съобщение беше изпратено успешно",
          icon: "success",
          confirmButtonColor: "#ffa500",
        }).then(() => {
          event.target.reset()
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      Swal.fire({
        title: "Грешка!",
        text: "Възникна проблем при изпращането на съобщението. Моля, опитайте отново.",
        icon: "error",
        confirmButtonColor: "#ffa500",
      })
    }
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.contactWrapper}>
          <div className={styles.contactInfo}>
            <h2>Свържете се с нас</h2>
            <p>Имате въпроси? Не се колебайте да се свържете с нас. Нашият екип ще ви отговори възможно най-скоро.</p>

            <div className={styles.infoItem}>
              <FaPhoneAlt className={styles.infoIcon} />
              <div>
                <h3>Телефон</h3>
                <p>+123 456 7890</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaEnvelope className={styles.infoIcon} />
              <div>
                <h3>Имейл</h3>
                <p>info@chefconnect.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <div>
                <h3>Адрес</h3>
                <p>ул. Примерна 123, София</p>
              </div>
            </div>

            <div className={styles.workingHours}>
              <h3>Работно време</h3>
              <p>Пон-Пет: 10:00 - 22:00</p>
              <p>Съб-Нед: 11:00 - 23:00</p>
            </div>
          </div>

          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Изпратете съобщение</h2>
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <FaUser className={styles.inputIcon} />
                <input type="text" className={styles.input} placeholder="Вашето име" name="name" required />
              </div>

              <div className={styles.inputGroup}>
                <FaEnvelope className={styles.inputIcon} />
                <input type="email" className={styles.input} placeholder="Вашият имейл" name="email" required />
              </div>

              <div className={styles.inputGroup}>
                <FaCommentAlt className={`${styles.inputIcon} ${styles.textareaIcon}`} />
                <textarea
                  name="message"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Вашето съобщение"
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Изпратете съобщение
              </button>
            </form>
          </div>
        </div>
      </div>
      
    </>
  )
}

export default Contact

