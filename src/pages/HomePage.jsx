"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./HomePage.module.css"
import hall1600 from "../assets/images/opt/hall-1600.jpg"
import hall900 from "../assets/images/opt/hall-900.jpg"
import AboutUs from "./AboutUs"
import PhotoGallery from "./PhotoGallery"
import Location from "./Location"
import { FaArrowUp, FaArrowRight } from "react-icons/fa"

export function HomePage() {
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
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="hero-title" className={styles.title}>
              <span className={styles.titleSmall}>Добре дошли в</span>
              <span className={styles.titleBig} data-text="ChefConnect">
                ChefConnect
              </span>
            </h1>
            <p className={styles.tagline}>Изживейте кулинарното съвършенство във всяка хапка.</p>
            <div className={styles.actions}>
              <Link to="/reservations" className={`btn btn--primary ${styles.actionBtn}`}>
                Запази маса
              </Link>
              <Link to="/products" className={`btn btn--paper ${styles.actionBtn}`}>
                Към менюто <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <figure className={styles.plate}>
            <img
              src={hall1600}
              srcSet={`${hall900} 900w, ${hall1600} 1600w`}
              sizes="(max-width: 900px) 100vw, 45vw"
              alt="Зимната градина на ресторанта: стъклен покрив, висящи растения и стъклени лампи над масите"
              className={styles.heroImage}
              width="1600"
              height="1046"
            />
          </figure>
        </div>

        <dl className={styles.colophon}>
          <div>
            <dt>Пон – Пет</dt>
            <dd>10:00 – 22:00</dd>
          </div>
          <div>
            <dt>Съб – Нед</dt>
            <dd>11:00 – 23:00</dd>
          </div>
          <div>
            <dt>Адрес</dt>
            <dd>бул. Княз Борис I 66, Варна</dd>
          </div>
          <div>
            <dt>Резервации</dt>
            <dd>
              <a href="tel:+1234567890">+123 456 7890</a>
            </dd>
          </div>
        </dl>
      </section>

      <AboutUs />
      <PhotoGallery />
      <Location />

      {isVisible && (
        <button className="to-top" onClick={scrollToTop} aria-label="Нагоре към началото">
          <FaArrowUp />
        </button>
      )}
    </div>
  )
}

export default HomePage
