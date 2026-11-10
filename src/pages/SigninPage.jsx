"use client"

import { useState, useContext, useEffect } from "react"
import styles from "./SigninPage.module.css"
import { FaUser, FaEnvelope, FaLock, FaCheck, FaTimes } from "react-icons/fa"
import UserCTX from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../api"
import hall900 from "../assets/images/opt/hall-900.jpg"

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
        await refreshUserData()
        navigate("/", { replace: true })
      } else {
        setError(result.message || "Възникна грешка при влизането")
      }
    } catch {
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
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess("Регистрацията е успешна!")
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
        setError(result.message || "Възникна грешка при регистрацията")
      }
    } catch {
      setError("Възникна грешка при свързването със сървъра")
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <aside className={styles.aside}>
          <p className={styles.asideMark}>ChefConnect</p>
          <ul className={styles.perks}>
            <li>Запазвайте маса онлайн</li>
            <li>Получавайте потвърждения в „Съобщения“</li>
            <li>Управлявайте профила си</li>
          </ul>
          <div className={styles.plate} aria-hidden="true">
            <img src={hall900} alt="" loading="lazy" />
          </div>
        </aside>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>{isLogin ? "Влезте в акаунта си" : "Създайте акаунт"}</h1>
          <div className={styles.tabContainer} role="group" aria-label="Вход или регистрация">
            <button
              type="button"
              className={`${styles.tabButton} ${isLogin ? styles.activeTab : ""}`}
              aria-pressed={isLogin}
              onClick={() => setIsLogin(true)}
            >
              Влезте в акаунт
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${!isLogin ? styles.activeTab : ""}`}
              aria-pressed={!isLogin}
              onClick={() => setIsLogin(false)}
            >
              Създайте акаунт
            </button>
          </div>

          {error && (
            <div className="notice notice--error" role="alert">
              <FaTimes aria-hidden="true" /> {error}
            </div>
          )}
          {success && (
            <div className="notice notice--success" role="status">
              <FaCheck aria-hidden="true" /> {success}
            </div>
          )}

          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className={styles.form}>
            {!isLogin && (
              <div className="field">
                <label htmlFor="signin-name" className="field-label">
                  <FaUser aria-hidden="true" /> Име
                </label>
                <input
                  id="signin-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => handleBlur("name")}
                  autoComplete="name"
                  required
                  aria-invalid={touched.name && !nameValid}
                  aria-describedby={touched.name && !nameValid ? "signin-name-error" : undefined}
                />
                {touched.name && !nameValid && (
                  <div id="signin-name-error" className={styles.validationError}>
                    Моля, въведете вашето име
                  </div>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="signin-email" className="field-label">
                <FaEnvelope aria-hidden="true" /> Имейл
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                autoComplete="email"
                required
                aria-invalid={touched.email && !emailValid}
                aria-describedby={touched.email && !emailValid ? "signin-email-error" : undefined}
              />
              {touched.email && !emailValid && (
                <div id="signin-email-error" className={styles.validationError}>
                  Моля, въведете валиден имейл адрес
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="signin-password" className="field-label">
                <FaLock aria-hidden="true" /> Парола
              </label>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password")}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                aria-invalid={touched.password && !passwordValid}
                aria-describedby={!isLogin ? "signin-password-rules" : undefined}
              />

              {!isLogin && (
                <ul id="signin-password-rules" className={styles.passwordRequirements}>
                  <li className={passwordFeedback.length ? styles.requirementMet : touched.password ? styles.requirementNotMet : ""}>
                    {passwordFeedback.length ? <FaCheck aria-hidden="true" /> : <FaTimes aria-hidden="true" />} Минимум 8 символа
                  </li>
                  <li className={passwordFeedback.number ? styles.requirementMet : touched.password ? styles.requirementNotMet : ""}>
                    {passwordFeedback.number ? <FaCheck aria-hidden="true" /> : <FaTimes aria-hidden="true" />} Поне една цифра
                  </li>
                  <li className={passwordFeedback.special ? styles.requirementMet : touched.password ? styles.requirementNotMet : ""}>
                    {passwordFeedback.special ? <FaCheck aria-hidden="true" /> : <FaTimes aria-hidden="true" />} Поне един специален символ (!@#$%^&*)
                  </li>
                </ul>
              )}
            </div>

            {!isLogin && (
              <div className="field">
                <label htmlFor="signin-repeat" className="field-label">
                  <FaLock aria-hidden="true" /> Повторете паролата
                </label>
                <input
                  id="signin-repeat"
                  type="password"
                  value={repeatPassword}
                  onChange={handleRepeatPasswordChange}
                  onBlur={() => handleBlur("repeatPassword")}
                  autoComplete="new-password"
                  required
                  aria-invalid={touched.repeatPassword && !passwordsMatch}
                  aria-describedby={touched.repeatPassword && !passwordsMatch ? "signin-repeat-error" : undefined}
                />
                {touched.repeatPassword && !passwordsMatch && (
                  <div id="signin-repeat-error" className={styles.validationError}>
                    Паролите не съвпадат
                  </div>
                )}
              </div>
            )}

            <button type="submit" className={`btn btn--primary ${styles.submitButton}`}>
              {isLogin ? "Вход" : "Регистрация"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SigninPage
