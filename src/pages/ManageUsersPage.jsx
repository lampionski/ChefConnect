"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom" // Added for navigation
import { FaSearch, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa" // Added FaArrowLeft
import styles from "./ManageUsers.module.css"
import UserCTX from "../context/UserContext"

const ManageUsersPage = () => {
  const navigate = useNavigate() // Added for navigation
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(UserCTX)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/admin/users", {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredUsers = users.filter((user) => user.fullname.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (user) => {
    setEditingUser({ ...user })
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
        credentials: "include",
      })
      if (response.ok) {
        fetchUsers()
        setEditingUser(null)
      } else {
        throw new Error("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        })
        if (response.ok) {
          fetchUsers()
        } else {
          throw new Error("Failed to delete user")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  // Added goBack function
  const goBack = () => {
    navigate(-1) // Navigate back to previous page
  }

  if (loading) return <div>Зарежда...</div>
  if (error) return <div>Грешка: {error}</div>

  return (
    <div className={styles.manageUsers}>
      <h1>Управление на Потребители</h1>
      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Търсене по име" value={searchTerm} onChange={handleSearch} />
      </div>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Име</th>
            <th>Имейл</th>
            <th>Роля</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)} className={styles.editButton}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(user._id)} className={styles.deleteButton}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Редактиране на Потребител</h2>
            <input
              type="text"
              value={editingUser.fullname}
              onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })}
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
              <option value="user">Потребител</option>
              <option value="worker">Работник</option>
              <option value="admin">Администратор</option>
            </select>
            <button onClick={handleSave}>Запази</button>
            <button onClick={() => setEditingUser(null)}>Откажи промени</button>
          </div>
        </div>
      )}

      {/* Back button */}
      <button className={styles.backButton} onClick={goBack} aria-label="Go back">
        <FaArrowLeft />
      </button>
    </div>
  )
}

export default ManageUsersPage

