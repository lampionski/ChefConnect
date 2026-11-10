"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom" // Added for navigation
import { FaSearch, FaEdit, FaTrash, FaArrowLeft, FaUser, FaExclamationTriangle } from "react-icons/fa"
import styles from "./ManageUsers.module.css"
import UserCTX from "../context/UserContext"
import { API_BASE_URL } from "../api"

const ManageUsersPage = () => {
  const navigate = useNavigate() // Added for navigation
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(UserCTX)

  useEffect(() => {
    if (user?.role !== "admin") { navigate("/"); return }
    fetchUsers()
  }, [user, navigate])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Потребителите не могат да бъдат заредени.")
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

  const filteredUsers = users.filter((entry) => (entry.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (user) => {
    setEditingUser({ ...user })
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${editingUser._id}`, {
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
        throw new Error("Промените не могат да бъдат запазени.")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert(error.message)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете този потребител?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        })
        if (response.ok) {
          fetchUsers()
        } else {
          throw new Error("Потребителят не може да бъде изтрит.")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        alert(error.message)
      }
    }
  }

  // Added goBack function
  const goBack = () => {
    navigate(-1) // Navigate back to previous page
  }

  // Function to translate role names to Bulgarian
  const translateRole = (role) => {
    switch (role) {
      case "admin":
        return "Администратор"
      case "worker":
        return "Работник"
      case "user":
        return "Потребител"
      default:
        return role
    }
  }

  const back = (
    <button className="back-link" onClick={goBack}>
      <FaArrowLeft aria-hidden="true" /> Назад
    </button>
  )

  if (loading) return <div className="page">{back}<p className="loader" role="status">Зарежда…</p></div>
  if (error) return <div className="page">{back}<p className="notice notice--error" role="alert"><FaExclamationTriangle aria-hidden="true" /> Грешка: {error === "Failed to fetch" ? "няма връзка със сървъра." : error}</p></div>

  return (
    <div className={`page ${styles.manageUsers}`}>
      {back}
      <header className="page-head">
        <h1 className="page-title">Управление на потребители</h1>
        <p className="page-lede">{users.length} регистрирани акаунта</p>
      </header>
      <div className={styles.searchBar}>
        <label htmlFor="user-search" className="visually-hidden">Търсене по име</label>
        <FaSearch className={styles.searchIcon} aria-hidden="true" />
        <input id="user-search" className="input" type="search" placeholder="Търсене по име" value={searchTerm} onChange={handleSearch} />
      </div>
      {filteredUsers.length === 0 ? (
        <div className="state">
          <strong>Няма намерени потребители.</strong>
          <span>Опитайте с друго име.</span>
        </div>
      ) : (
      <div className="table-wrap">
      <table className="data-table data-table--stack">
        <thead>
          <tr>
            <th scope="col" className={styles.photoColumn}><span className="visually-hidden">Снимка</span></th>
            <th scope="col">Име</th>
            <th scope="col">Имейл</th>
            <th scope="col">Роля</th>
            <th scope="col">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className={styles.photoCell}>
                {user.photo ? (
                  <img src={user.photo || "/placeholder.svg"} alt="" className={styles.userPhoto} />
                ) : (
                  <div className={styles.userPhotoPlaceholder}>
                    <FaUser aria-hidden="true" />
                  </div>
                )}
              </td>
              <td data-label="Име" className={styles.name}>{user.fullname}</td>
              <td data-label="Имейл" className={styles.email}>{user.email}</td>
              <td data-label="Роля">
                <span className={`tag ${styles.roleTag} ${styles[user.role] || ""}`}>{translateRole(user.role)}</span>
              </td>
              <td data-label="Действия">
                <div className="row-actions">
                <button onClick={() => handleEdit(user)} className="btn btn--small" aria-label={`Редактирай ${user.fullname}`}>
                  <FaEdit aria-hidden="true" /> Редактирай
                </button>
                <button onClick={() => handleDelete(user._id)} className="btn btn--danger btn--small btn--icon" aria-label={`Изтрий ${user.fullname}`}>
                  <FaTrash aria-hidden="true" />
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
            <div className={styles.modalHead}>
              {editingUser.photo ? (
                <img
                  src={editingUser.photo || "/placeholder.svg"}
                  alt=""
                  className={styles.editingUserPhoto}
                />
              ) : (
                <div className={styles.editingUserPhotoPlaceholder}>
                  <FaUser aria-hidden="true" />
                </div>
              )}
              <h2 id="edit-user-title">Редактиране на потребител</h2>
            </div>
            <div className={styles.modalFields}>
              <div className="field">
                <label htmlFor="edit-user-name" className="field-label">Име</label>
                <input
                  id="edit-user-name"
                  type="text"
                  value={editingUser.fullname}
                  onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="edit-user-email" className="field-label">Имейл</label>
                <input
                  id="edit-user-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="edit-user-role" className="field-label">Роля</label>
                <select id="edit-user-role" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="user">Потребител</option>
                  <option value="worker">Работник</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleSave} className="btn btn--primary">
                Запази
              </button>
              <button onClick={() => setEditingUser(null)} className="btn btn--ghost">
                Откажи промени
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage

