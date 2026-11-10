"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { FaCamera, FaLock, FaTimes, FaCheck } from "react-icons/fa"
import styles from "./Profile.module.css"
import UserCTX from "../context/UserContext"
import { API_BASE_URL } from "../api"
import Cropper from "react-easy-crop"
import { useNavigate } from "react-router-dom"

const emptyProfile = {
  fullname: "",
  email: "",
  username: "",
  birthDate: "",
  photo: "",
  address: "",
  phoneNumber: "",
}

const Profile = () => {
  const { user: contextUser, setUser: setContextUser } = useContext(UserCTX)
  const navigate = useNavigate()
  const [user, setUser] = useState(emptyProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Crop related states
  const [showCropModal, setShowCropModal] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile`, {
        credentials: "include",
      })
      if (response.ok) {
        const userData = await response.json()
        setUser({ ...emptyProfile, ...userData })
      } else if (response.status === 401) {
        setContextUser(null)
        navigate("/signin", { replace: true })
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      if (contextUser) {
        setUser({ ...emptyProfile, ...contextUser })
      }
    }
  }, [contextUser, navigate, setContextUser])

  useEffect(() => {
    if (!contextUser) {
      navigate("/signin", { replace: true })
      return
    }
    fetchUserData()
  }, [contextUser, fetchUserData, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  // Handle photo upload and cropping
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) { alert("Изберете JPG, PNG или WebP до 3 MB"); return }
      const reader = new FileReader()
      reader.onloadend = () => {
        // Instead of directly setting the photo, we set the image source for cropping
        setImageSrc(reader.result)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas size to match the bounding box
    const scale = Math.min(1, 512 / Math.max(pixelCrop.width, pixelCrop.height))
    canvas.width = Math.round(pixelCrop.width * scale)
    canvas.height = Math.round(pixelCrop.height * scale)

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    // Return as a data URL
    return canvas.toDataURL("image/jpeg")
  }

  const handleSaveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      setUser((prevUser) => ({
        ...prevUser,
        photo: croppedImage,
      }))
      setShowCropModal(false)
      setImageSrc(null)
    } catch (e) {
      console.error("Error getting cropped image:", e)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          birthDate: user.birthDate,
          address: user.address,
          phoneNumber: user.phoneNumber,
          photo: user.photo,
        }),
        credentials: "include",
      })
      if (response.ok) {
        alert("Профилът е обновен успешно")
        await fetchUserData() // Refresh user data after update
        setIsEditing(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Неуспешно обновяване на профила")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert(error.message)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Паролите не съвпадат")
      return
    }
    if (newPassword.length < 8 || newPassword.length > 128 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      alert("Паролата трябва да има 8–128 символа, цифра и специален символ")
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      })
      if (response.ok) {
        setNewPassword("")
        setCurrentPassword("")
        setConfirmPassword("")
        setShowPasswordModal(false)
        setContextUser(null)
        navigate("/signin", { replace: true })
        alert("Паролата е сменена. Влезте отново.")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Неуспешна смяна на паролата")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert(error.message)
    }
  }

  const field = (id, label, input) => (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}</label>
      {input}
    </div>
  )

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Потребителски профил</h1>
        <p className="page-lede">
          {isEditing ? "Редактирайте данните си и запазете промените." : "Вашите данни за контакт и резервации."}
        </p>
      </header>
      <div className={styles.profileContent}>
        <div className={styles.profilePhoto}>
          <div className={styles.photoFrame}>
            <img src={user.photo || "/placeholder.svg"} alt={user.photo ? "Профилна снимка" : ""} />
            {isEditing && (
              <label className={styles.uploadPhotoLabel}>
                <FaCamera aria-hidden="true" />
                <span>Смени снимката</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            )}
          </div>
          <p className={styles.photoName}>{user.fullname}</p>
          <p className={styles.photoMail}>{user.email}</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.grid}>
            {field("profile-fullname", "Име", <input id="profile-fullname" type="text" name="fullname" value={user.fullname ?? ""} disabled={true} />)}
            {field("profile-email", "Имейл", <input id="profile-email" type="email" name="email" value={user.email ?? ""} disabled={true} />)}
            {field("profile-username", "Прякор", <input
              id="profile-username"
              type="text"
              name="username"
              value={user.username ?? ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Добавете прякор"
            />)}
            {field("profile-birth", "Рождена дата", <input
              id="profile-birth"
              type="date"
              name="birthDate"
              value={user.birthDate ?? ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />)}
            {field("profile-address", "Адрес", <input
              id="profile-address"
              type="text"
              name="address"
              value={user.address ?? ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Добавете адрес"
              autoComplete="street-address"
            />)}
            {field("profile-phone", "Телефонен номер", <input
              id="profile-phone"
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber ?? ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Добавете телефон"
              autoComplete="tel"
            />)}
          </div>
          <div className={styles.buttonGroup}>
            {isEditing ? (
              <button className="btn btn--primary">Запази промени</button>
            ) : (
              <button
                type="button"
                onClick={(e) => (e.preventDefault(), setIsEditing(true))}
                className="btn"
              >
                Редактирай профила
              </button>
            )}
            <button
              type="button"
              onClick={(e) => (e.preventDefault(), setShowPasswordModal(true))}
              className="btn btn--ghost"
            >
              <FaLock aria-hidden="true" /> Смени паролата
            </button>
          </div>
        </form>
      </div>

      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="password-dialog-title">
            <h2 id="password-dialog-title">Промяна на парола</h2>
            <form onSubmit={handlePasswordChange} className={styles.modalForm}>
              <div className="field">
                <label htmlFor="pw-current" className="field-label">Текуща парола</label>
                <input id="pw-current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required autoFocus />
              </div>
              <div className="field">
                <label htmlFor="pw-new" className="field-label">Нова парола</label>
                <input
                  id="pw-new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength="8"
                  autoComplete="new-password"
                  aria-describedby="pw-new-hint"
                  required
                />
                <span id="pw-new-hint" className="field-hint">8–128 символа, поне една цифра и един специален символ (!@#$%^&*)</span>
              </div>
              <div className="field">
                <label htmlFor="pw-confirm" className="field-label">Потвърдете новата парола</label>
                <input
                  id="pw-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="8"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn--primary">
                  Промяна на парола
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn--ghost">
                  Откажи
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropModal && (
        <div className="modal-backdrop">
          <div className={`modal ${styles.cropContainer}`} role="dialog" aria-modal="true" aria-labelledby="crop-dialog-title">
            <div className={styles.cropHeader}>
              <h3 id="crop-dialog-title">Редактирайте снимката</h3>
              <button
                className="btn btn--ghost btn--icon"
                aria-label="Затвори"
                onClick={() => {
                  setShowCropModal(false)
                  setImageSrc(null)
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.cropperWrapper}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className={styles.cropControls}>
              <div className={styles.zoomControl}>
                <label htmlFor="crop-zoom" className="field-label">Увеличение</label>
                <input
                  id="crop-zoom"
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn--ghost"
                  onClick={() => {
                    setShowCropModal(false)
                    setImageSrc(null)
                  }}
                >
                  Откажи
                </button>
                <button className="btn btn--primary" onClick={handleSaveCroppedImage}>
                  <FaCheck aria-hidden="true" /> Запази
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

