"use client"

import { useState, useEffect } from "react"
import styles from "./ManageMenu.module.css"

export default function ManageMenu() {
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
  }, [])

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  return (
    <div className={styles.container}>
      <h2>Manage Menu</h2>

      {!editingItem ? (
        <div className={styles.addItemContainer}>
          <form onSubmit={handleAddItem} className={styles.addItemForm}>
            <h3>Add New Item</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleInputChange}
            />
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button type="submit">Add Item</button>
          </form>
          <div className={styles.imagePreview}>
            <h3>Image Preview</h3>
            {formData.image ? (
              <img src={formData.image || "/placeholder.svg"} alt="Preview" />
            ) : (
              <div className={styles.placeholderImage}>No image URL provided</div>
            )}
          </div>
        </div>
      ) : (
        <form className={styles.addItemForm}>
          <h3>Edit Item</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editingItem.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={editingItem.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editingItem.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL (Optional)"
            value={editingItem.image}
            onChange={handleInputChange}
          />
          <select name="category" value={editingItem.category} onChange={handleInputChange} required>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button type="button" onClick={saveEdit}>
            Save
          </button>
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      )}

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
        <h3>Existing Menu Items</h3>
        {selectedCategory === "All" ? (
          categories.slice(1).map((category) => (
            <div key={category} className={styles.categorySection}>
              <h4 className={styles.categoryTitle}>{category}</h4>
              <div className={styles.categoryItems}>
                {filteredItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item._id} className={styles.menuItem}>
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <p>Price: ${item.price}</p>
                      </div>
                      <button onClick={() => startEditing(item)}>Edit</button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.categoryItems}>
            {filteredItems.map((item) => (
              <div key={item._id} className={styles.menuItem}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p>Price: ${item.price}</p>
                </div>
                <button onClick={() => startEditing(item)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

