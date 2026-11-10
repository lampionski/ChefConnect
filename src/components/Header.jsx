"use client"

import { useState, useContext, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { FaPhoneAlt, FaBars, FaTimes, FaUserCog, FaSignOutAlt, FaEnvelope, FaUser, FaChevronDown } from "react-icons/fa"
import { API_BASE_URL } from '../api';
import UserCTX from "../context/UserContext"
import styles from "./Header.module.css"

const navClass = ({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)

export default function Header() {
  const userData = useContext(UserCTX)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
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

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  const logout = async () => {
    await fetch(`${API_BASE_URL}/logout`, { method: "POST", credentials: "include" })
    window.location.replace("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const firstName = userData.user?.fullname?.split(" ")[0]

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand} aria-label="ChefConnect – начало">
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandName}>ChefConnect</span>
        </Link>

        <a href="tel:+1234567890" className={styles.phone}>
          <FaPhoneAlt aria-hidden="true" />
          <span>+123 456 7890</span>
        </a>

        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={isMobile ? menuOpen : undefined}
          aria-controls="site-nav"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav id="site-nav" aria-label="Основна навигация" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
            Начало
          </NavLink>
          <NavLink to="/products" className={navClass} onClick={() => setMenuOpen(false)}>
            Меню
          </NavLink>
          <NavLink to="/reservations" className={navClass} onClick={() => setMenuOpen(false)}>
            Резервация
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>
            Връзка с нас
          </NavLink>

          {userData.user ? (
            <>
              {/* For mobile: show user menu items directly in the main menu */}
              {isMobile && (
                <div className={styles.mobileAccount}>
                  {userData.user.role === "admin" && (
                    <Link to="/adminPanel" className={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                      <FaUserCog aria-hidden="true" /> Админ панел
                    </Link>
                  )}
                  <Link to="/profile" className={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                    <FaUser aria-hidden="true" /> Профил
                  </Link>
                  <Link to="/messages" className={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                    <FaEnvelope aria-hidden="true" /> Съобщения
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className={`${styles.mobileMenuItem} ${styles.mobileSignOut}`}
                  >
                    <FaSignOutAlt aria-hidden="true" /> Излез от профила
                  </button>
                </div>
              )}

              {/* For desktop: account button with dropdown */}
              <div className={styles.userMenu}>
                <button
                  type="button"
                  onClick={toggleMenu}
                  className={styles.accountButton}
                  aria-expanded={!isMobile ? menuOpen : undefined}
                  aria-haspopup="true"
                  aria-controls="account-menu"
                >
                  {userData.user.photo ? (
                    <img src={userData.user.photo} alt="" className={styles.avatar} />
                  ) : (
                    <FaUser aria-hidden="true" />
                  )}
                  <span>{firstName || "Профил"}</span>
                  <FaChevronDown aria-hidden="true" className={styles.chevron} />
                </button>
                {menuOpen && !isMobile && (
                  <div className={styles.dropdownMenu} id="account-menu">
                    {userData.user.role === "admin" && (
                      <Link to="/adminPanel" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                        <FaUserCog aria-hidden="true" /> Админ панел
                      </Link>
                    )}
                    <Link to="/profile" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                      <FaUser aria-hidden="true" /> Профил
                    </Link>
                    <Link to="/messages" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                      <FaEnvelope aria-hidden="true" /> Съобщения
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMenuOpen(false)
                      }}
                      className={`${styles.menuItem} ${styles.signOut}`}
                    >
                      <FaSignOutAlt aria-hidden="true" /> Излез от профила
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/signin" className={`btn btn--primary btn--small ${styles.signUpButton}`} onClick={() => setMenuOpen(false)}>
              Вписване
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
