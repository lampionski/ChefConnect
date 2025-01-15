import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; 
import styles from "./Header.module.css"; 
import { FaPhoneAlt } from 'react-icons/fa';  

export default function Header() {
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
        <Link to="/signin"><button>Sign up</button></Link>
      </nav>
    </header>
  );
}
