"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaPhoneAlt, FaBars, FaUserCog, FaSignOutAlt, FaEnvelope } from "react-icons/fa"
import UserCTX from "../context/UserContext"
import styles from "./Header.module.css"
import logo from "../assets/logo.png"

export default function Header() {
  const userData = useContext(UserCTX)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = async () => {
    await fetch("http://localhost:3000/logout", { credentials: "include" })
    userData.setUser(null)
    navigate("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoWithPhone}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo || "/placeholder.svg"} className={styles.logo} alt="logo" />
        </Link>
        <div className={styles.phoneNumber}>
          <FaPhoneAlt className={styles.phoneIcon} />
          <span>+123 456 7890</span>
        </div>
      </div>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/products">Menu</Link>
        <Link to="/reservations">Reserve Table</Link>
        <Link to="/contact">Contact us</Link>
        {userData.user ? (
          <div className={styles.userMenu}>
            <FaBars onClick={toggleMenu} className={styles.menuIcon} />
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                {userData.user.role === "admin" && (
                  <Link to="/adminPanel" className={styles.menuItem}>
                    <FaUserCog /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" className={styles.menuItem}>
                  <FaUserCog /> Profile
                </Link>
                <Link to="/messages" className={styles.menuItem}>
                  <FaEnvelope /> Messages
                </Link>
                <button onClick={logout} className={`${styles.menuItem} ${styles.signOut}`}>
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className={styles.signUpButton}>
            Sign up
          </Link>
        )}
      </nav>
      <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle mobile menu">
        <FaBars />
      </button>
    </header>
  )
}

