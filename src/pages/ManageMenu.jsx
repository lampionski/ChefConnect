"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // Added useNavigate
import styles from "./ManageMenu.module.css"
import { FaArrowUp, FaArrowLeft } from "react-icons/fa" // Added FaArrowLeft

export default function ManageMenu() {
  const navigate = useNavigate() // Added for navigation
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuResponse, categoryResponse] = await Promise.all([
          fetch("http://localhost:3000/get-menu"),
          fetch("http://localhost:3000/get-categories"),
        ])

        if (!menuResponse.ok || !categoryResponse.ok) {
          throw new Error("Failed to fetch data.")
        }

        const [menuData, categoryData] = await Promise.all([menuResponse.json(), categoryResponse.json()])

        setMenuItems(menuData)
        setCategories(["All", ...categoryData])
        setFormData((prev) => ({ ...prev, category: categoryData[0] || "" }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

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

  const goBack = () => {
    navigate(-1) // Navigate back to previous page
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingItem) {
      setEditingItem((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert("Please fill out all required fields.")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/add-menu-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add menu item.")
      }

      const newItem = await response.json()
      setMenuItems((prev) => [...prev, newItem])
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: categories[1] || "",
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const startEditing = (item) => {
    setEditingItem({ ...item })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/update-menu-item/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      })

      if (!response.ok) {
        throw new Error("Failed to update menu item.")
      }

      const updatedItem = await response.json()
      setMenuItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
      setEditingItem(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`http://localhost:3000/delete-menu-item/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete menu item.")
      }

      setMenuItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <p>Зарежда...</p>
  if (error) return <p>Грешка: {error}</p>

  // Fix the filter to work with "All" instead of "Всичко"
  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const renderForm = (data, isEditing) => (
    <div className={styles.addItemContainer}>
      <form onSubmit={isEditing ? undefined : handleAddItem} className={styles.addItemForm}>
        <h3>{isEditing ? "Променете продукт" : "Добавете нов продукт"}</h3>
        <input type="text" name="name" placeholder="Име" value={data.name} onChange={handleInputChange} required />
        <textarea
          name="description"
          placeholder="Описание"
          value={data.description}
          onChange={handleInputChange}
          required
        ></textarea>
        <input type="number" name="price" placeholder="Цена" value={data.price} onChange={handleInputChange} required />
        <input type="text" name="image" placeholder="Image URL" value={data.image} onChange={handleInputChange} />
        <select name="category" value={data.category} onChange={handleInputChange} required>
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {isEditing ? (
          <>
            <button type="button" onClick={saveEdit}>
              Запази
            </button>
            <button type="button" onClick={cancelEdit} className={styles.cancelButton}>
              Отказажи
            </button>
          </>
        ) : (
          <button type="submit">Добавете продукт</button>
        )}
      </form>
      <div className={styles.imagePreview}>
        <h3>Снимка</h3>
        {data.image ? (
          <img src={data.image || "/placeholder.svg"} alt="Preview" />
        ) : (
          <div className={styles.placeholderImage}>Не е добавен URL за снимка</div>
        )}
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <h2>Редактиране на меню</h2>

      {editingItem ? renderForm(editingItem, true) : renderForm(formData, false)}

      <div className={styles.filterContainer}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.menuList}>
        <h3>Същестуващи продукти</h3>
        {selectedCategory === "All" ? (
          // When "All" is selected, show all categories with their items
          categories
            .slice(1)
            .map((category) => (
              <div key={category} className={styles.categorySection}>
                <h4 className={styles.categoryTitle}>{category}</h4>
                <div className={styles.categoryItems}>
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div key={item._id} className={styles.menuItem}>
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                        <div>
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                          <p>Цена:{item.price} лв</p>
                        </div>
                        <button onClick={() => startEditing(item)}>Edit</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                          Изтрийте
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))
        ) : (
          // When a specific category is selected, show only items from that category
          <div className={styles.categoryItems}>
            {filteredItems.map((item) => (
              <div key={item._id} className={styles.menuItem}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>Цена:{item.price} лв</p>
                </div>
                <button onClick={() => startEditing(item)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                  Изтрийте
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back button */}
      <button className={styles.backButton} onClick={goBack} aria-label="Go back">
        <FaArrowLeft />
      </button>

      {showScrollTop && (
        <button className={styles.scrollTopButton} onClick={scrollToTop} aria-label="Scroll to top">
          <FaArrowUp />
        </button>
      )}
    </div>
  )
}

