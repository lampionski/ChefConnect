"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaPhoneAlt, FaBars, FaUserCog, FaSignOutAlt, FaEnvelope } from "react-icons/fa"
import UserCTX from "../context/UserContext"
import styles from "./Header.module.css"
import logo from "../assets/logo.png"

export default function Header() {
  const userData = useContext(UserCTX)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname]) // Close menu when route changes

  // useEffect(() => {
  //   if (userData.user) {
  //     const fetchUnreadMessages = async () => {
  //       try {
  //         const response = await fetch(`http://localhost:3000/unread-messages/${userData.user._id}`, {
  //           credentials: "include",
  //         })
  //         if (response.ok) {
  //           const data = await response.json()
  //           setUnreadMessages(data.count)
  //         }
  //       } catch (error) {
  //         console.error("Error fetching unread messages:", error)
  //       }
  //     }
  //     fetchUnreadMessages()
  //   }
  // }, [userData.user])

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

      <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle mobile menu">
        <FaBars />
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Начало
        </Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Меню
        </Link>
        <Link to="/reservations" onClick={() => setMenuOpen(false)}>
          Резервация
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Връзка с нас
        </Link>

        {userData.user ? (
          <>
            {/* For mobile: show user menu items directly in the main menu */}
            {isMobile && userData.user.role === "admin" && (
              <Link to="/adminPanel" className={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                <FaUserCog /> Админ Панел
              </Link>
            )}

            {isMobile && (
              <>
                <Link to="/profile" className={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                  <FaUserCog /> Профил
                </Link>
                <Link to="/messages" className={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                  <FaEnvelope /> Съобщения
                  {unreadMessages > 0 && <span className={styles.unreadBadge}>{unreadMessages}</span>}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className={`${styles.mobileMenuItem} ${styles.mobileSignOut}`}
                >
                  <FaSignOutAlt /> Излез от Профил
                </button>
              </>
            )}

            {/* For desktop: show the burger menu icon with dropdown */}
            <div className={styles.userMenu}>
              <FaBars onClick={toggleMenu} className={styles.menuIcon} />
              {menuOpen && !isMobile && (
                <div className={styles.dropdownMenu}>
                  {userData.user.role === "admin" && (
                    <Link to="/adminPanel" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                      <FaUserCog /> Админ Панел
                    </Link>
                  )}
                  <Link to="/profile" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <FaUserCog /> Профил
                  </Link>
                  <Link to="/messages" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <FaEnvelope /> Съобщения
                    {unreadMessages > 0 && <span className={styles.unreadBadge}>{unreadMessages}</span>}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className={`${styles.menuItem} ${styles.signOut}`}
                  >
                    <FaSignOutAlt /> Излез от Профил
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/signin" className={styles.signUpButton} onClick={() => setMenuOpen(false)}>
            Вписване
          </Link>
        )}
      </nav>
    </header>
  )
}

