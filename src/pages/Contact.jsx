"use client"

import styles from "./Contact.module.css"
import Swal from "sweetalert2"
import { FaUser, FaEnvelope, FaCommentAlt } from "react-icons/fa"

const Contact = () => {
  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    formData.append("access_key", "f80f01ba-c73c-47cd-814a-e3473041d96a")

    const object = Object.fromEntries(formData)
    const json = JSON.stringify(object)

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
        title: "Success!",
        text: "Your message was sent successfully",
        icon: "success",
      }).then(() => {
        event.target.reset()
      })
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Свържете се с нас</h2>
          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <FaUser className={styles.inputIcon} />
              <input type="text" className={styles.input} placeholder="Име" name="name" required />
            </div>
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input type="email" className={styles.input} placeholder="Email адрес" name="email" required />
            </div>
            <div className={styles.inputGroup}>
              <textarea
                name="message"
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Твоето съобщение "
                required
              ></textarea>
              <FaCommentAlt className={`${styles.inputIcon} ${styles.textareaIcon}`} />
            </div>
            <button type="submit" className={styles.submitButton}>
              Изпратете съобщение
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact

