import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import styles from "./Header.module.css";
import { FaPhoneAlt, FaBars, FaUserCog } from "react-icons/fa";
import { useContext, useState } from "react";
import UserCTX from "../context/UserContext";

export default function Header() {
  const userData = useContext(UserCTX);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" });
    userData.setUser(null);
    navigate("/");
  };

  const handleMouseLeave = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoWithPhone}>
        <Link to="/">
          <img src={logo} className={styles.Logo} alt="logo" />
        </Link>
        <div className={styles.phoneNumber}>
          <FaPhoneAlt className={styles.phoneIcon} />
          <span>+123 456 7890</span>
        </div>
      </div>
      <nav className={styles.Nav}>
        <Link to="/">Home</Link>
        <Link to="/products">Menu</Link>
        <Link to="/reservations">Reserve Table</Link>
        <Link to="/contact">Contact us</Link>
        {userData.user ? (
          <div
            className={styles.burgerMenu}
            onMouseLeave={handleMouseLeave}
          >
            <FaBars
              onClick={() => setMenuOpen((prev) => !prev)}
              className={styles.menuIcon}
            />
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                {/* Conditional links for admin and user roles */}
                {userData.user.role === "admin" && (
                  <Link to="/adminPanel" className={styles.menuItem}>
                    <FaUserCog /> Admin Panel
                  </Link>
                )}
                <Link to="/profile" className={styles.menuItem}>
                  <FaUserCog /> Profile
                </Link>
                <button onClick={logout} className={styles.menuItem}>
                  <FaUserCog /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin">
            <button>Sign up</button>
          </Link>
        )}
      </nav>
    </header>
  );
}
