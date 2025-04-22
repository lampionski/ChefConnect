"use client"

import { useState, useContext, useEffect } from "react"
import styles from "./SigninPage.module.css"
import { FaUser, FaEnvelope, FaLock, FaCheck, FaTimes } from "react-icons/fa"
import UserCTX from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../api"

const SigninPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { refreshUserData } = useContext(UserCTX)
  const navigate = useNavigate()

  // Validation states
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [nameValid, setNameValid] = useState(true)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [passwordFeedback, setPasswordFeedback] = useState({
    length: false,
    number: false,
    special: false,
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    name: false,
    repeatPassword: false,
  })

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  // Validate password requirements
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*]/.test(password)

    setPasswordFeedback({
      length: hasMinLength,
      number: hasNumber,
      special: hasSpecial,
    })

    return hasMinLength && hasNumber && hasSpecial
  }

  // Check if passwords match
  useEffect(() => {
    if (touched.repeatPassword) {
      setPasswordsMatch(password === repeatPassword)
    }
  }, [password, repeatPassword, touched.repeatPassword])

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (touched.email) {
      setEmailValid(validateEmail(value))
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    if (touched.password) {
      setPasswordValid(validatePassword(value))
    }
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    if (touched.name) {
      setNameValid(value.trim().length > 0)
    }
  }

  const handleRepeatPasswordChange = (e) => {
    const value = e.target.value
    setRepeatPassword(value)
    if (touched.repeatPassword) {
      setPasswordsMatch(password === value)
    }
  }

  // Handle input blur events to mark fields as touched
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })

    // Validate on blur
    if (field === "email") {
      setEmailValid(validateEmail(email))
    } else if (field === "password") {
      setPasswordValid(validatePassword(password))
    } else if (field === "name") {
      setNameValid(name.trim().length > 0)
    } else if (field === "repeatPassword") {
      setPasswordsMatch(password === repeatPassword)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok) {
        // Store the access token and refresh user data
        localStorage.setItem("accessToken", result.accessToken)
        await refreshUserData() // Refresh user data to get role information
        // Redirect to protected route or home page
        navigate("/")
      } else {
        setError(result.error || "Възникна грешка при влизането")
      }
    } catch (error) {
      setError("Възникна грешка при свързването със сървъра")
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")

    // Validate all fields before submission
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isNameValid = name.trim().length > 0
    const doPasswordsMatch = password === repeatPassword

    setEmailValid(isEmailValid)
    setPasswordValid(isPasswordValid)
    setNameValid(isNameValid)
    setPasswordsMatch(doPasswordsMatch)

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      name: true,
      repeatPassword: true,
    })

    // If any validation fails, stop submission
    if (!isEmailValid || !isPasswordValid || !isNameValid || !doPasswordsMatch) {
      setError("Моля, коригирайте грешките във формата")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: name,
          email,
          password,
          recaptchaToken: "dummy-token", // You should implement proper reCAPTCHA
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess("Регистрацията е успешна! Моля, проверете имейла си за потвърждение.")
        // Clear form
        setName("")
        setEmail("")
        setPassword("")
        setRepeatPassword("")
        // Reset touched states
        setTouched({
          email: false,
          password: false,
          name: false,
          repeatPassword: false,
        })
      } else {
        setError(result.error || "Възникна грешка при регистрацията")
      }
    } catch (error) {
      setError("Възникна грешка при свързването със сървъра")
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${!isLogin ? styles.activeTab : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Създайте акаунт
            </button>
            <button
              className={`${styles.tabButton} ${isLogin ? styles.activeTab : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Влезте в акаунт
            </button>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className={styles.form}>
            {!isLogin && (
              <div className={styles.formField}>
                <div className={styles.inputGroup}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onBlur={() => handleBlur("name")}
                    placeholder="Име"
                    required
                    className={`${styles.input} ${touched.name && !nameValid ? styles.inputError : ""}`}
                  />
                </div>
                {touched.name && !nameValid && <div className={styles.validationError}>Моля, въведете вашето име</div>}
              </div>
            )}

            <div className={styles.formField}>
              <div className={styles.inputGroup}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="Email"
                  required
                  className={`${styles.input} ${touched.email && !emailValid ? styles.inputError : ""}`}
                />
              </div>
              {touched.email && !emailValid && (
                <div className={styles.validationError}>Моля, въведете валиден имейл адрес</div>
              )}
            </div>

            <div className={styles.formField}>
              <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="Парола"
                  required
                  className={`${styles.input} ${touched.password && !passwordValid ? styles.inputError : ""}`}
                />
              </div>

              {!isLogin && touched.password && (
                <div className={styles.passwordRequirements}>
                  <div className={passwordFeedback.length ? styles.requirementMet : styles.requirementNotMet}>
                    {passwordFeedback.length ? <FaCheck /> : <FaTimes />} Минимум 8 символа
                  </div>
                  <div className={passwordFeedback.number ? styles.requirementMet : styles.requirementNotMet}>
                    {passwordFeedback.number ? <FaCheck /> : <FaTimes />} Поне една цифра
                  </div>
                  <div className={passwordFeedback.special ? styles.requirementMet : styles.requirementNotMet}>
                    {passwordFeedback.special ? <FaCheck /> : <FaTimes />} Поне един специален символ (!@#$%^&*)
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className={styles.formField}>
                <div className={styles.inputGroup}>
                  <FaLock className={styles.inputIcon} />
                  <input
                    type="password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    onBlur={() => handleBlur("repeatPassword")}
                    placeholder="Повторете парола"
                    required
                    className={`${styles.input} ${touched.repeatPassword && !passwordsMatch ? styles.inputError : ""}`}
                  />
                </div>
                {touched.repeatPassword && !passwordsMatch && (
                  <div className={styles.validationError}>Паролите не съвпадат</div>
                )}
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              {isLogin ? "Вход" : "Регистрация"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SigninPage
