// AboutUs.jsx
import { Link } from 'react-router-dom';
import styles from './AboutUs.module.css';
import photo1 from '../assets/images/opt/aboutUs.jpg';

export function AboutUs() {
    return (
        <section className={styles.aboutUs} aria-labelledby="about-title">
            <div className={styles.aboutUsContent}>
                <div className={styles.textContainer}>
                    <h2 id="about-title" className={styles.title}>За ресторанта</h2>
                    <p className={styles.lead}>
                    През далечната 1999 г. във Варна е открит първият ресторант ГОДЗИЛА. За 20 години имаме 5 ресторанта и спечелихме доверието на нашите гости с разнообразна и модерна кухня, атрактивни цени и отлично обслужване.
                    </p>
                    <p className={styles.manifest}>
                        <span>Елегантен.</span> <span>Провокативен.</span> <span>Артистичен.</span>
                    </p>
                    <p>
                    Светъл, с усещане за безкрайност. Модерен, но с човешки облик. Мястото, където в спокойствие и уют можеш да хапнеш вкусно и да избягаш за малко от големия град. Прекрасно пространство за всякакъв арт формат, това е интериора на най-новия ни ресторант в София.
                    </p>
                    <p className={styles.signoff}>
                    Заповядайте и се убедете сами!</p>

                    <Link to="/contact" className={`btn btn--ghost ${styles.contactButton}`}>
                        Контакт
                    </Link>
                </div>
                <figure className={styles.imageContainer}>
                    <span className={styles.imageClip}>
                    <img
                        src={photo1}
                        alt="Терасата на ресторанта с тюркоазени маси, кожени дивани и зелена стена"
                        className={styles.aboutImage}
                        width="555"
                        height="454"
                        loading="lazy"
                    />
                    </span>
                </figure>
            </div>
        </section>
    );
}

export default AboutUs;
