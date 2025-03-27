"use client"

import { useState, useEffect } from "react"
import classes from "./ProductsPage.module.css"
import { FaArrowUp } from "react-icons/fa"
import { API_BASE_URL } from '../api';

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
          throw new Error("Failed to fetch menu items.")
        }
        const data = await response.json()
        setMenuItems(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
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
          throw new Error("Failed to fetch categories.")
        }
        const data = await response.json()
        setCategories(["All", ...data])
      } catch (err) {
        setError(err.message)
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

  if (loading) {
    return <p className={classes.loading}>Зарежда...</p>
  }

  if (error) {
    return <p className={classes.error}>{error}</p>
  }

  return (
    <div className={classes.container}>
      <h2>Меню</h2>
      <div className={classes.filterContainer}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${classes.filterButton} ${
              category === (cat === "All" ? "" : cat) ? classes.active : ""
            } ${cat === "All" ? classes.defaultFilter : ""}`}
            onClick={() => setCategory(cat === "All" ? "" : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {sortedMenuItems.length === 0 ? (
        <p>Няма продукт в тази категория.</p>
      ) : (
        <ul className={classes.menuList}>
          {category === "" ? (
            categories.slice(1).map((cat) => (
              <li key={cat} className={classes.categorySection}>
                <h3 className={classes.categoryTitle}>{cat}</h3>
                <ul className={classes.categoryItems}>
                  {sortedMenuItems
                    .filter((item) => item.category === cat)
                    .map((item) => (
                      <li key={item._id} className={classes.menuItem}>
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className={classes.menuItemImage} />
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <p>{item.price}лв</p>
                      </li>
                    ))}
                </ul>
              </li>
            ))
          ) : (
            <li className={classes.categorySection}>
              <ul className={classes.categoryItems}>
                {sortedMenuItems.map((item) => (
                  <li key={item._id} className={classes.menuItem}>
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className={classes.menuItemImage} />
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p>{item.price}лв</p>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      )}

      {showScrollTop && (
        <button className={classes.scrollTopButton} onClick={scrollToTop} aria-label="Scroll to top">
          <FaArrowUp />
        </button>
      )}

      

    </div>
  )
}

