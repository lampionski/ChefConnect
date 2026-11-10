"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import classes from "./ProductsPage.module.css"
import { FaArrowUp, FaExclamationTriangle } from "react-icons/fa"
import { API_BASE_URL, menuImageSrc } from '../api';

function renderMenuRow(item) {
  return (
    <li key={item._id} className={classes.menuItem}>
      <Link to={`/products/${item._id}`} className={classes.itemLink}>
        <span className={classes.thumb}>
          {item.image ? (
            <img src={menuImageSrc(item.image)} alt="" className={classes.menuItemImage} loading="lazy" />
          ) : (
            <span className={classes.noImage} aria-hidden="true" />
          )}
        </span>
        <span className={classes.itemText}>
          <span className={classes.itemHead}>
            <span className={classes.itemName}>{item.name}</span>
            <span className={classes.leader} aria-hidden="true" />
            <span className={classes.price}>{item.price} лв.</span>
          </span>
          {item.description && <span className={classes.description}>{item.description}</span>}
        </span>
      </Link>
    </li>
  )
}

export default function ProductsPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-menu${category ? `?category=${category}` : ""}`)
        if (!response.ok) {
          throw new Error("Менюто не може да бъде заредено в момента.")
        }
        const data = await response.json()
        setMenuItems(data)
        setLoading(false)
      } catch (err) {
        setError(err.message === "Failed to fetch" ? "Няма връзка със сървъра. Опитайте отново след малко." : err.message)
        setLoading(false)
      }
    }
    fetchMenu()
  }, [category])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-categories`)
        if (!response.ok) {
          throw new Error("Категориите не могат да бъдат заредени.")
        }
        const data = await response.json()
        setCategories(["Всички", ...data])
      } catch (err) {
        setError(err.message === "Failed to fetch" ? "Няма връзка със сървъра. Опитайте отново след малко." : err.message)
      }
    }
    fetchCategories()

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => {
    if (category === "") {
      return a.category.localeCompare(b.category)
    }
    return 0
  })

  const header = (
    <header className="page-head">
      <h1 className="page-title">Меню</h1>
      <p className="page-lede">Изберете категория или разгледайте цялото меню. Натиснете ястие, за да видите повече.</p>
    </header>
  )

  if (loading) {
    return (
      <div className="page">
        {header}
        <p className="loader" role="status">Зарежда менюто…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        {header}
        <p className="notice notice--error" role="alert">
          <FaExclamationTriangle aria-hidden="true" /> {error}
        </p>
      </div>
    )
  }

  return (
    <div className={`page ${classes.container}`}>
      {header}
      <div className={classes.filterBar}>
        <div className="chips" role="group" aria-label="Категории">
          {categories.map((cat) => (
            <button
              key={cat}
              className="chip"
              aria-pressed={category === (cat === "Всички" ? "" : cat)}
              onClick={() => setCategory(cat === "Всички" ? "" : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {sortedMenuItems.length === 0 ? (
        <div className="state">
          <strong>Няма продукт в тази категория.</strong>
          <span>Изберете друга категория или вижте цялото меню.</span>
        </div>
      ) : (
        <ul className={classes.menuList}>
          {category === "" ? (
            categories.slice(1).map((cat) => {
              const items = sortedMenuItems.filter((item) => item.category === cat)
              if (items.length === 0) return null
              return (
                <li key={cat} className={classes.categorySection}>
                  <h2 className={classes.categoryTitle}>{cat}</h2>
                  <ul className={classes.categoryItems}>
                    {items.map(renderMenuRow)}
                  </ul>
                </li>
              )
            })
          ) : (
            <li className={classes.categorySection}>
              <h2 className={classes.categoryTitle}>{category}</h2>
              <ul className={classes.categoryItems}>
                {sortedMenuItems.map(renderMenuRow)}
              </ul>
            </li>
          )}
        </ul>
      )}

      {showScrollTop && (
        <button className="to-top" onClick={scrollToTop} aria-label="Нагоре към началото">
          <FaArrowUp />
        </button>
      )}
    </div>
  )
}
