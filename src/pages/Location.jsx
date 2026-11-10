// Location.jsx
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Location.module.css';

const Location = () => {
    return (
        <section className={styles.location} aria-labelledby="visit-title">
            <div className={styles.inner}>
                <h2 id="visit-title" className={styles.title}>Посетете ни</h2>
                <div className={styles.body}>
                    <p className={styles.address}>булевард Княз Борис I 66, Варна, BG 9000</p>
                    <p className={styles.hours}>Пон – Пет 10:00 – 22:00 · Съб – Нед 11:00 – 23:00</p>
                    <div className={styles.actions}>
                        <a
                            className="btn btn--ghost"
                            href="https://www.google.com/maps/search/?api=1&query=%D0%B1%D1%83%D0%BB.+%D0%9A%D0%BD%D1%8F%D0%B7+%D0%91%D0%BE%D1%80%D0%B8%D1%81+I+66%2C+%D0%92%D0%B0%D1%80%D0%BD%D0%B0"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaMapMarkerAlt aria-hidden="true" /> Отвори в картата
                        </a>
                        <Link to="/reservations" className="btn btn--primary">Запази маса</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Location;
