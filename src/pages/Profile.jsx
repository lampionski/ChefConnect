"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { FaCamera, FaLock, FaTimes, FaCheck } from "react-icons/fa"
import styles from "./Profile.module.css"
import UserCTX from "../context/UserContext"
import { API_BASE_URL } from "../api"
import Cropper from "react-easy-crop"

const Profile = () => {
  const { user: contextUser } = useContext(UserCTX)
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    username: "",
    birthDate: "",
    photo: "",
    address: "",
    phoneNumber: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
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
        console.log(userData)
        setUser(userData)
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      if (contextUser) {
        setUser(contextUser)
      }
    }
  }, [contextUser])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

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

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    // Set canvas size to match the bounding box
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
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
        alert("Profile updated successfully")
        await fetchUserData() // Refresh user data after update
        setIsEditing(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert(error.message)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }
    try {
      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
        credentials: "include",
      })
      if (response.ok) {
        setNewPassword("")
        setConfirmPassword("")
        setShowPasswordModal(false)
        alert("Password changed successfully")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert(error.message)
    }
  }

  return (
    <div className={styles.profileContainer}>
      <h1>Потребителски Профил</h1>
      <div className={styles.profileContent}>
        <div className={styles.profilePhoto}>
          <img src={user.photo || "/placeholder.svg"} alt="Profile" />
          {isEditing && (
            <label className={styles.uploadPhotoLabel}>
              <FaCamera />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          )}
        </div>
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label>Име:</label>
            <input type="text" name="fullname" value={user.fullname} disabled={true} />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input type="email" name="email" value={user.email} disabled={true} />
          </div>
          <div className={styles.formGroup}>
            <label>Прякор:</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Добавете прякор"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Рожденна Дата:</label>
            <input
              type="date"
              name="birthDate"
              value={user.birthDate}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.formGroup}>
            <label>адрес:</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Добавете адрес"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Телефонен номер:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>
          <div className={styles.buttonGroup}>
            {isEditing ? (
              <button className={styles.saveButton}>Запази промени</button>
            ) : (
              <button
                type="button"
                onClick={(e) => (e.preventDefault(), setIsEditing(true))}
                className={styles.editButton}
              >
                Редактирай профила
              </button>
            )}
            <button
              type="button"
              onClick={(e) => (e.preventDefault(), setShowPasswordModal(true))}
              className={styles.changePasswordButton}
            >
              <FaLock /> Редактирай парола
            </button>
          </div>
        </form>
      </div>

      {showPasswordModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Промяна на парола</h2>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.formGroup}>
                <label>Нова парола:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength="8"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Потвърдете новата парола:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="8"
                  required
                />
              </div>
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.changePasswordButton}>
                  Промяна на парола
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className={styles.cancelButton}>
                  Откажи
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {showCropModal && (
        <div className={styles.cropModal}>
          <div className={styles.cropContainer}>
            <div className={styles.cropHeader}>
              <h3>Редактирайте снимката</h3>
              <button
                className={styles.closeButton}
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
                <label>Увеличение:</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
                />
              </div>
              <div className={styles.cropActions}>
                <button
                  className={styles.cancelCropButton}
                  onClick={() => {
                    setShowCropModal(false)
                    setImageSrc(null)
                  }}
                >
                  Откажи
                </button>
                <button className={styles.saveCropButton} onClick={handleSaveCroppedImage}>
                  <FaCheck /> Запази
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

