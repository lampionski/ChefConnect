"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserCTX from "../context/UserContext"
import styles from "./ManageWorkersPage.module.css"
import { API_BASE_URL } from '../api';
import {
  FaUserTie,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaPaperPlane,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaHistory,
  FaArrowLeft, // Added FaArrowLeft
} from "react-icons/fa"

const ManageWorkersPage = () => {
  const [workers, setWorkers] = useState([])
  const [workerTasks, setWorkerTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tasksLoading, setTasksLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    deadlineTime: "12:00",
  })
  const [successMessage, setSuccessMessage] = useState("")

  const { user } = useContext(UserCTX)
  const navigate = useNavigate()

  // Added goBack function
  const goBack = () => {
    navigate(-1) // Navigate back to previous page
  }

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }

    // Fetch workers
    const fetchWorkers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/workers`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch workers")
        }

        const data = await response.json()
        setWorkers(data)
      } catch (err) {
        console.error("Error fetching workers:", err)
        setError("Failed to load workers. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [user, navigate])

  const fetchWorkerTasks = async (workerId) => {
    setTasksLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/worker-tasks/${workerId}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch worker tasks")
      }

      const data = await response.json()
      setWorkerTasks(data)
    } catch (err) {
      console.error("Error fetching worker tasks:", err)
      setError("Failed to load worker tasks. Please try again later.")
    } finally {
      setTasksLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker)
    fetchWorkerTasks(worker._id)
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault()

    if (!selectedWorker) {
      setError("Моля, изберете работник")
      return
    }

    if (!taskForm.title || !taskForm.description || !taskForm.deadline) {
      setError("Моля, попълнете всички полета")
      return
    }

    setError("")

    try {
      // Format the deadline with time
      const deadlineWithTime = `${taskForm.deadline}T${taskForm.deadlineTime}`

      const response = await fetch(`${API_BASE_URL}/admin/assign-task`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId: selectedWorker._id,
          title: taskForm.title,
          description: taskForm.description,
          deadline: deadlineWithTime,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign task")
      }

      // Reset form
      setTaskForm({
        title: "",
        description: "",
        deadline: "",
        deadlineTime: "12:00",
      })

      // Show success message
      setSuccessMessage(`Задачата е успешно възложена на ${selectedWorker.fullname}`)

      // Refresh worker tasks
      fetchWorkerTasks(selectedWorker._id)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err) {
      console.error("Error assigning task:", err)
      setError("Неуспешно възлагане на задача. Моля, опитайте отново.")
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-"

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"

    return date.toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "-"

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"

    return date.toLocaleTimeString("bg-BG", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if deadline is passed
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false

    const deadlineDate = new Date(deadline)
    const now = new Date()

    return deadlineDate < now
  }

  // Truncate text for display
  const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (loading) return <div className={styles.loading}>Зареждане...</div>
  if (error && !workers.length) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.manageWorkersContainer}>
      <h2>Управление на Работници</h2>

      <div className={styles.contentWrapper}>
        <div className={styles.workersList}>
          <h3>
            <FaUserTie /> Списък с Работници
          </h3>
          {workers.length === 0 ? (
            <p className={styles.noWorkers}>Няма намерени работници</p>
          ) : (
            <ul>
              {workers.map((worker) => (
                <li
                  key={worker._id}
                  className={`${styles.workerItem} ${selectedWorker?._id === worker._id ? styles.selected : ""}`}
                  onClick={() => handleWorkerSelect(worker)}
                >
                  <div className={styles.workerAvatar}>
                    <img
                      src={worker.photo || "/placeholder.svg"}
                      alt={worker.fullname}
                      className={styles.workerPhoto}
                    />
                  </div>
                  <div className={styles.workerInfo}>
                    <strong>{worker.fullname}</strong>
                    <span>{worker.position}</span>
                    <span className={styles.workerEmail}>{worker.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {selectedWorker && (
            <div className={styles.workerTasksContainer}>
              <h4>
                <FaHistory /> История на задачите
              </h4>

              {tasksLoading ? (
                <p className={styles.tasksLoading}>Зареждане на задачите...</p>
              ) : workerTasks.length === 0 ? (
                <p className={styles.noTasks}>Няма възложени задачи</p>
              ) : (
                <div className={styles.tasksTableWrapper}>
                  <table className={styles.tasksTable}>
                    <thead>
                      <tr>
                        <th>Задача</th>
                        <th>Краен срок</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workerTasks.map((task) => {
                        const deadlinePassed = isDeadlinePassed(task.deadline)
                        const status =
                          task.status === "completed" ? "completed" : deadlinePassed ? "overdue" : "pending"

                        return (
                          <tr key={task._id} className={styles[status]}>
                            <td>
                              <div className={styles.taskTitle}>
                                {truncateText(task.title.replace("Нова задача: ", ""))}
                              </div>
                            </td>
                            <td>
                              <div className={styles.taskDeadline}>
                                {formatDate(task.deadline)}
                                <br />
                                {formatTime(task.deadline)}
                              </div>
                            </td>
                            <td>
                              <div className={styles.taskStatus}>
                                {status === "completed" ? (
                                  <>
                                    <FaCheckCircle className={styles.statusIcon} />
                                    <span>Изпълнена</span>
                                  </>
                                ) : status === "overdue" ? (
                                  <>
                                    <FaExclamationTriangle className={styles.statusIcon} />
                                    <span>Просрочена</span>
                                  </>
                                ) : (
                                  <>
                                    <FaHourglassHalf className={styles.statusIcon} />
                                    <span>В процес</span>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.taskAssignment}>
          <h3>
            <FaClipboardList /> Възлагане на Задача
          </h3>

          {selectedWorker ? (
            <div className={styles.selectedWorker}>
              <div className={styles.selectedWorkerContent}>
                <img
                  src={selectedWorker.photo || "/placeholder.svg"}
                  alt={selectedWorker.fullname}
                  className={styles.selectedWorkerPhoto}
                />
                <p>
                  Избран работник: <strong>{selectedWorker.fullname}</strong>
                </p>
              </div>
            </div>
          ) : (
            <p className={styles.noSelection}>Моля, изберете работник от списъка</p>
          )}

          <form onSubmit={handleSubmitTask} className={styles.taskForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Заглавие на задачата:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={taskForm.title}
                onChange={handleInputChange}
                placeholder="Въведете заглавие"
                disabled={!selectedWorker}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Описание на задачата:</label>
              <textarea
                id="description"
                name="description"
                value={taskForm.description}
                onChange={handleInputChange}
                placeholder="Въведете подробно описание на задачата"
                rows="4"
                disabled={!selectedWorker}
              ></textarea>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="deadline">
                  <FaCalendarAlt /> Краен срок (дата):
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={taskForm.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  disabled={!selectedWorker}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="deadlineTime">
                  <FaClock /> Час:
                </label>
                <input
                  type="time"
                  id="deadlineTime"
                  name="deadlineTime"
                  value={taskForm.deadlineTime}
                  onChange={handleInputChange}
                  disabled={!selectedWorker}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={!selectedWorker}>
              <FaPaperPlane /> Възложи Задача
            </button>
          </form>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </div>
      </div>

      {/* Back button */}
      <button className={styles.backButton} onClick={goBack} aria-label="Go back">
        <FaArrowLeft />
      </button>
    </div>
  )
}

export default ManageWorkersPage

