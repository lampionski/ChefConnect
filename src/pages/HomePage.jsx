"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./HomePage.module.css"
import photo1 from "../assets/images/img1Car.jpg"
import AboutUs from "./AboutUs"
import PhotoGallery from "./PhotoGallery"
import Location from "./Location"
import UserCTX from "../context/UserContext"
import { FaArrowUp } from "react-icons/fa" // Import the arrow icon

export function HomePage() {
  const navigate = useNavigate()
  const { language } = useContext(UserCTX)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className={styles.homepage}>
      <header className={styles.hero}>
        <img src={photo1 || "/placeholder.svg"} alt="Hero" className={styles.heroImage} />
        <div className={styles.overlay}>
          <h1>{language === "en" ? "Welcome to ChefConnect" : "Добре дошли в ChefConnect"}</h1>
          <p>
            {language === "en"
              ? "Experience culinary excellence in every bite."
              : "Изживейте кулинарното съвършенство във всяка хапка."}
          </p>
          <button className={styles.menuButton} onClick={() => navigate("/products")}>
            {language === "en" ? "Go to Menu" : "Към Менюто"}
          </button>
        </div>
      </header>

      <AboutUs />
      <PhotoGallery />
      <Location />

      {isVisible && (
        <button className={styles.scrollToTop} onClick={scrollToTop} aria-label="Scroll to top">
          <FaArrowUp />
        </button>
      )}

      <footer className={styles.footer}>
        <p>© 2024 ChefConnect. {language === "en" ? "All Rights Reserved." : "Всички права запазени."}</p>
      </footer>
    </div>
  )
}

export default HomePage

