"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./SigninPage.module.css"
import UserCTX from "../context/UserContext"
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"

const SigninPage = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const userData = useContext(UserCTX)

  useEffect(() => {
    setError("")
    setSuccess("")
  }, [])

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (password !== repeatPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname: name, email, password }),
      })

      const result = await response.json()
      if (response.status === 201) {
        setSuccess("Sign-up successful! Please log in.")
        setIsLogin(true)
        userData.setUser({})
      } else {
        setError(result.error || "Sign-up failed")
      }
    } catch (err) {
      setError("Server error: " + err.message)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 200) {
        userData.setUser({})
        navigate("/")
      } else {
        const result = await response.json()
        setError(result.error || "Sign-in failed")
      }
    } catch (err) {
      setError("Server error: " + err.message)
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
              Sign Up
            </button>
            <button
              className={`${styles.tabButton} ${isLogin ? styles.activeTab : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className={styles.form}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <FaUser className={styles.inputIcon} />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Username"
                  required
                  className={styles.input}
                />
              </div>
            )}
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <FaLock className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className={styles.input}
              />
            </div>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Repeat Password"
                  required
                  className={styles.input}
                />
              </div>
            )}
            <button type="submit" className={styles.submitButton}>
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SigninPage
