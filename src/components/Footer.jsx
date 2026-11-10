import { Link } from "react-router-dom"
import styles from "./Footer.module.css"
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandBlock}>
          <p className={styles.wordmark}>ChefConnect</p>
          <p className={styles.description}>
            Изживейте кулинарното съвършенство във всяка хапка. Нашият ресторант предлага изискана кухня в елегантна
            атмосфера.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        <nav className={styles.footerSection} aria-label="Бързи връзки">
          <h2>Бързи връзки</h2>
          <ul className={styles.linkList}>
            <li>
              <Link to="/">Начало</Link>
            </li>
            <li>
              <Link to="/products">Меню</Link>
            </li>
            <li>
              <Link to="/reservations">Резервация</Link>
            </li>
            <li>
              <Link to="/contact">Връзка с нас</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.footerSection}>
          <h2>Контакти</h2>
          <dl className={styles.contactList}>
            <div>
              <dt>Телефон</dt>
              <dd>
                <a href="tel:+1234567890">+123 456 7890</a>
              </dd>
            </div>
            <div>
              <dt>Имейл</dt>
              <dd>
                <a href="mailto:info@chefconnect.com">info@chefconnect.com</a>
              </dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>бул. Княз Борис I 66, Варна</dd>
            </div>
          </dl>
        </div>

        <div className={styles.footerSection}>
          <h2>Работно време</h2>
          <dl className={styles.hours}>
            <div>
              <dt>Пон – Пет</dt>
              <dd>10:00 – 22:00</dd>
            </div>
            <div>
              <dt>Съб – Нед</dt>
              <dd>11:00 – 23:00</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>&copy; {currentYear} ChefConnect. Всички права запазени.</span>
        <span>Варна, България</span>
      </div>
    </footer>
  )
}

export default Footer
