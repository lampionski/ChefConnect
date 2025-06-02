import { Link } from "react-router-dom"
import styles from "./Footer.module.css"
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa"
import logo from "../assets/logo.png" 

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.logoContainer}>
            <img src={logo || "/placeholder.svg"} alt="ChefConnect Logo" className={styles.logo} />
            <h3>ChefConnect</h3>
          </div>
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

        <div className={styles.footerSection}>
          <h4>Бързи Връзки</h4>
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
        </div>

        <div className={styles.footerSection}>
          <h4>Контакти</h4>
          <ul className={styles.contactList}>
            <li>
              <FaPhoneAlt className={styles.contactIcon} />
              <span>+123 456 7890</span>
            </li>
            <li>
              <FaEnvelope className={styles.contactIcon} />
              <span>info@chefconnect.com</span>
            </li>
            <li>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>бул. Руски 11а, Пловдив, България</span>
            </li>
            <li>
              <FaClock className={styles.contactIcon} />
              <span>Пон-Пет: 10:00 - 22:00</span>
            </li>
            <li className={styles.noIcon}>
              <span className={styles.indent}>Съб-Нед: 11:00 - 23:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.copyright}>&copy; {currentYear} ChefConnect. Всички права запазени.</div>
        <div className={styles.legalLinks}>
          <Link to="/privacy-policy">Политика за поверителност</Link>
          <Link to="/terms-of-service">Общи условия</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer

