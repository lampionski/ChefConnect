"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom" // Added useNavigate
import styles from "./ManageMenu.module.css"
import { FaArrowUp, FaArrowLeft, FaEdit, FaTrash, FaExclamationTriangle, FaImage } from "react-icons/fa"
import { API_BASE_URL, menuImageSrc } from '../api';
import UserCTX from "../context/UserContext"

export default function ManageMenu() {
  const navigate = useNavigate() // Added for navigation
  const { user } = useContext(UserCTX)
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
  const [selectedCategory, setSelectedCategory] = useState("Всички")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const clearSelectedFile = () => {
    setImageFile(null)
    setPreviewUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      alert("Изберете JPG, PNG или WebP снимка до 5 MB.")
      clearSelectedFile()
      return
    }
    setImageFile(file || null)
    setPreviewUrl(file ? URL.createObjectURL(file) : "")
  }

  const itemBody = (data) => {
    const body = new FormData()
    for (const field of ['name', 'description', 'price', 'category', 'image']) body.append(field, data[field] ?? '')
    if (imageFile) body.append('imageFile', imageFile)
    return body
  }

  useEffect(() => {
    if (user?.role !== "admin") { navigate("/"); return }
    const fetchData = async () => {
      try {
        const [menuResponse, categoryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/get-menu`),
          fetch(`${API_BASE_URL}/get-categories`),
        ])

        if (!menuResponse.ok || !categoryResponse.ok) {
          throw new Error("Менюто не може да бъде заредено.")
        }

        const [menuData, categoryData] = await Promise.all([menuResponse.json(), categoryResponse.json()])

        setMenuItems(menuData)
        setCategories(["Всички", ...categoryData])
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
  }, [user, navigate])

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
      alert("Моля, попълнете всички задължителни полета.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add-menu-item`, {
        method: "POST",
        credentials: "include",
        body: itemBody(formData),
      })

      if (!response.ok) {
        throw new Error("Продуктът не може да бъде добавен.")
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
      clearSelectedFile()
    } catch (err) {
      alert(err.message)
    }
  }

  const startEditing = (item) => {
    clearSelectedFile()
    setEditingItem({ ...item })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const saveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-menu-item/${editingItem._id}`, {
        method: "PUT",
        credentials: "include",
        body: itemBody(editingItem),
      })

      if (!response.ok) {
        throw new Error("Промените не могат да бъдат запазени.")
      }

      const updatedItem = await response.json()
      setMenuItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
      setEditingItem(null)
      clearSelectedFile()
    } catch (err) {
      alert(err.message)
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    clearSelectedFile()
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този продукт?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/delete-menu-item/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Продуктът не може да бъде изтрит.")
      }

      setMenuItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const back = (
    <button className="back-link" onClick={goBack}>
      <FaArrowLeft aria-hidden="true" /> Назад
    </button>
  )

  if (loading) return <div className="page">{back}<p className="loader" role="status">Зарежда…</p></div>
  if (error) return <div className="page">{back}<p className="notice notice--error" role="alert"><FaExclamationTriangle aria-hidden="true" /> Грешка: {error === "Failed to fetch" ? "няма връзка със сървъра." : error}</p></div>

  // Fix the filter to work with "All" instead of "Всичко"
  const filteredItems =
    selectedCategory === "Всички" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const renderForm = (data, isEditing) => (
    <div className={`${styles.addItemContainer} ${isEditing ? styles.editing : ""}`}>
      <form onSubmit={isEditing ? undefined : handleAddItem} className={styles.addItemForm}>
        <h2 className={styles.formTitle}>{isEditing ? `Променете продукт: ${data.name}` : "Добавете нов продукт"}</h2>
        <div className={styles.formGrid}>
          <div className={`field ${styles.span2}`}>
            <label htmlFor="menu-name" className="field-label">Име</label>
            <input id="menu-name" type="text" name="name" value={data.name} onChange={handleInputChange} required />
          </div>
          <div className={`field ${styles.span2}`}>
            <label htmlFor="menu-description" className="field-label">Описание</label>
            <textarea
              id="menu-description"
              name="description"
              value={data.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="field">
            <label htmlFor="menu-price" className="field-label">Цена (лв.)</label>
            <input id="menu-price" type="number" name="price" value={data.price} onChange={handleInputChange} required />
          </div>
          <div className="field">
            <label htmlFor="menu-category" className="field-label">Категория</label>
            <select id="menu-category" name="category" value={data.category} onChange={handleInputChange} required>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className={`field ${styles.span2}`}>
            <label htmlFor="menu-image" className="field-label">Снимка чрез линк</label>
            <input id="menu-image" type="text" name="image" placeholder="https://…" value={data.image} onChange={handleInputChange} />
          </div>
          <div className={`field ${styles.span2}`}>
            <label htmlFor="menu-image-file" className="field-label">Или качете снимка от компютъра</label>
            <input id="menu-image-file" ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
            <small className={styles.imageHint}>JPG, PNG или WebP до 5 MB. Избраният файл има предимство пред линка.</small>
          </div>
        </div>
        <div className={styles.formActions}>
        {isEditing ? (
          <>
            <button type="button" className="btn btn--primary" onClick={saveEdit}>
              Запази
            </button>
            <button type="button" onClick={cancelEdit} className="btn btn--ghost">
              Откажи
            </button>
          </>
        ) : (
          <button type="submit" className="btn btn--primary">Добавете продукт</button>
        )}
        </div>
      </form>
      <div className={styles.imagePreview}>
        <p className={styles.previewLabel}>Преглед на снимката</p>
        {previewUrl || data.image ? (
          <img src={previewUrl || menuImageSrc(data.image)} alt="Преглед на снимката" />
        ) : (
          <div className={styles.placeholderImage}>
            <FaImage aria-hidden="true" />
            <span>Все още няма снимка</span>
          </div>
        )}
      </div>
    </div>
  )

  const renderItem = (item) => (
    <li key={item._id} className={styles.menuItem}>
      <img src={menuImageSrc(item.image) || "/placeholder.svg"} alt="" />
      <div className={styles.itemText}>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </div>
      <p className={styles.price}>{item.price} лв.</p>
      <div className="row-actions">
        <button className="btn btn--small" onClick={() => startEditing(item)}>
          <FaEdit aria-hidden="true" /> Редактирай
        </button>
        <button className="btn btn--danger btn--small" onClick={() => handleDelete(item._id)}>
          <FaTrash aria-hidden="true" /> Изтрийте
        </button>
      </div>
    </li>
  )

  return (
    <div className={`page ${styles.container}`}>
      {back}
      <header className="page-head">
        <h1 className="page-title">Редактиране на меню</h1>
        <p className="page-lede">{menuItems.length} продукта в {categories.length - 1} категории</p>
      </header>

      {editingItem ? renderForm(editingItem, true) : renderForm(formData, false)}

      <section className={styles.menuList} aria-labelledby="existing-title">
        <h2 id="existing-title" className={styles.listTitle}>Съществуващи продукти</h2>
        <div className={styles.filterBar}>
          <div className="chips" role="group" aria-label="Категории">
            {categories.map((category) => (
              <button
                key={category}
                className="chip"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="state">
            <strong>Няма продукти тук.</strong>
            <span>Добавете първия продукт от формата по-горе.</span>
          </div>
        ) : selectedCategory === "Всички" ? (
          // When "All" is selected, show all categories with their items
          categories
            .slice(1)
            .map((category) => {
              const items = menuItems.filter((item) => item.category === category)
              if (items.length === 0) return null
              return (
                <div key={category} className={styles.categorySection}>
                  <h3 className={styles.categoryTitle}>{category}</h3>
                  <ul className={styles.categoryItems}>{items.map(renderItem)}</ul>
                </div>
              )
            })
        ) : (
          // When a specific category is selected, show only items from that category
          <ul className={styles.categoryItems}>{filteredItems.map(renderItem)}</ul>
        )}
      </section>

      {showScrollTop && (
        <button className="to-top" onClick={scrollToTop} aria-label="Нагоре към началото">
          <FaArrowUp />
        </button>
      )}
    </div>
  )
}

