// "use client"

// import { useState, useContext, useEffect } from "react"
// import { Link, useNavigate, useLocation } from "react-router-dom"
// import { FaPhoneAlt, FaBars, FaUserCog, FaSignOutAlt, FaEnvelope } from "react-icons/fa"
// import UserCTX from "../context/UserContext"
// import styles from "./Header.module.css"
// import logo from "../assets/logo.png"

// export default function Header() {
//   const userData = useContext(UserCTX)
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [unreadMessages, setUnreadMessages] = useState(0)

//   useEffect(() => {
//     setMenuOpen(false)
//   }, [])

//   useEffect(() => {
//     if (userData.user) {
//       const fetchUnreadMessages = async () => {
//         try {
//           const response = await fetch(`http://localhost:3000/unread-messages/${userData.user._id}`)
//           if (response.ok) {
//             const data = await response.json()
//             setUnreadMessages(data.count)
//           }
//         } catch (error) {
//           console.error("Error fetching unread messages:", error)
//         }
//       }
//       fetchUnreadMessages()
//     }
//   }, [userData.user])

//   const logout = async () => {
//     await fetch("http://localhost:3000/logout", { credentials: "include" })
//     userData.setUser(null)
//     navigate("/")
//   }

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen)
//   }

//   return (
//     <header className={styles.header}>
//       <div className={styles.logoWithPhone}>
//         <Link to="/" className={styles.logoLink}>
//           <img src={logo || "/placeholder.svg"} className={styles.logo} alt="logo" />
//         </Link>
//         <div className={styles.phoneNumber}>
//           <FaPhoneAlt className={styles.phoneIcon} />
//           <span>+123 456 7890</span>
//         </div>
//       </div>
//       <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
//         <Link to="/" onClick={() => setMenuOpen(false)}>
//           Начало
//         </Link>
//         <Link to="/products" onClick={() => setMenuOpen(false)}>
//           Меню
//         </Link>
//         <Link to="/reservations" onClick={() => setMenuOpen(false)}>
//           Резервация
//         </Link>
//         <Link to="/contact" onClick={() => setMenuOpen(false)}>
//           Контакт
//         </Link>
//         {userData.user ? (
//           <div className={styles.userMenu}>
//             <FaBars onClick={toggleMenu} className={styles.menuIcon} />
//             {menuOpen && (
//               <div className={styles.dropdownMenu}>
//                 {userData.user.role === "admin" && (
//                   <Link to="/adminPanel" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
//                     <FaUserCog /> Админ панел
//                   </Link>
//                 )}
//                 <Link to="/profile" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
//                   <FaUserCog /> Профил
//                 </Link>
//                 <Link to="/messages" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
//                   <FaEnvelope /> Съобщения
//                   {unreadMessages > 0 && <span className={styles.unreadBadge}>{unreadMessages}</span>}
//                 </Link>
//                 <button
//                   onClick={() => {
//                     logout()
//                     setMenuOpen(false)
//                   }}
//                   className={`${styles.menuItem} ${styles.signOut}`}
//                 >
//                   <FaSignOutAlt /> Излез от Профил
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link to="/signin" className={styles.signUpButton} onClick={() => setMenuOpen(false)}>
//             Влез в Профил
//           </Link>
//         )}
//       </nav>
//       <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle mobile menu">
//         <FaBars />
//       </button>
//     </header>
//   )
// }



"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaPhoneAlt, FaBars, FaUserCog, FaSignOutAlt, FaEnvelope } from "react-icons/fa"
import UserCTX from "../context/UserContext"
import styles from "./Header.module.css"
import logo from "../assets/logo.png"

export default function Header() {
  const userData = useContext(UserCTX)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    setMenuOpen(false)
  }, [])

  useEffect(() => {
    if (userData.user) {
      const fetchUnreadMessages = async () => {
        try {
          const response = await fetch(`http://localhost:3000/unread-messages/${userData.user._id}`, {
            credentials: "include",
          })
          if (response.ok) {
            const data = await response.json()
            setUnreadMessages(data.count)
          }
        } catch (error) {
          console.error("Error fetching unread messages:", error)
        }
      }
      fetchUnreadMessages()
    }
  }, [userData.user])

  const logout = async () => {
    await fetch("http://localhost:3000/logout", { credentials: "include" })
    userData.setUser(null)
    navigate("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoWithPhone}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo || "/placeholder.svg"} className={styles.logo} alt="logo" />
        </Link>
        <div className={styles.phoneNumber}>
          <FaPhoneAlt className={styles.phoneIcon} />
          <span>+123 456 7890</span>
        </div>
      </div>
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>
          Menu
        </Link>
        <Link to="/reservations" onClick={() => setMenuOpen(false)}>
          Reserve Table
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact us
        </Link>
        {userData.user ? (
          <div className={styles.userMenu}>
            <FaBars onClick={toggleMenu} className={styles.menuIcon} />
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                {userData.user.role === "admin" && (
                  <Link to="/adminPanel" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                    <FaUserCog /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                  <FaUserCog /> Profile
                </Link>
                <Link to="/messages" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                  <FaEnvelope /> Messages
                  {unreadMessages > 0 && <span className={styles.unreadBadge}>{unreadMessages}</span>}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className={`${styles.menuItem} ${styles.signOut}`}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className={styles.signUpButton} onClick={() => setMenuOpen(false)}>
            Sign up
          </Link>
        )}
      </nav>
      <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle mobile menu">
        <FaBars />
      </button>
    </header>
  )
}

