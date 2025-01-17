import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; 
import styles from "./Header.module.css"; 
import { FaPhoneAlt } from 'react-icons/fa';  
import { useContext } from "react";
import UserCTX from "../context/UserContext";

export default function Header() {
  const userData = useContext(UserCTX);
  const navigate = useNavigate();

  const logout = async () => {
    await fetch('http://localhost:3000/logout', { method: 'POST', credentials: "include", });
    userData.setUser(null);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoWithPhone}>
        <img src={logo} className={styles.Logo} alt="logo" />
        <div className={styles.phoneNumber}>
          <FaPhoneAlt className={styles.phoneIcon} />
          <span>+123 456 7890</span> {/* Replace with your actual phone number */}
        </div>
      </div>
      <nav className={styles.Nav}>
        <Link to="/">Home</Link>
        <Link to="/products">Menu</Link>
        <Link to="/">Reserve Table</Link>
        <Link to="/contact">Contact us</Link>
        {userData.user ? <>
        <button onClick={logout}>Sign out</button>
        </>: <Link to="/signin"><button>Sign up</button></Link>}
      </nav>
    </header>
  );
}
