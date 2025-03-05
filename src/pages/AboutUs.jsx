// AboutUs.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './AboutUs.module.css';
import photo1 from '../assets/images/aboutUs.jpg'; // Hero Image

export function AboutUs() {
    const navigate = useNavigate(); // Initialize navigate function

    return (
        <section className={styles.aboutUs}>
            <div className={styles.aboutUsContent}>
                <div className={styles.imageContainer}>
                    <img 
                        src={photo1} // Replace with your image
                        alt="Restaurant Interior" 
                        className={styles.aboutImage}
                    />
                </div>
                <div className={styles.textContainer}>
                    <h2>За ресторанта</h2>
                    <p>
                    През далечната 1999 г. във Варна е открит първият ресторант ГОДЗИЛА. За 20 години имаме 5 ресторанта и спечелихме доверието на нашите гости с разнообразна и модерна кухня, нестандартни порции, атрактивни цени и отлично обслужване.
                    </p>
                    <p>
                    Елегантен и ярък, с усещане за безкрайност. Модерна, но с човешко лице. Мястото, където е на спокойствие и комфорт Можете да хапнете вкусно и да избягате за малко от големия град. Прекрасно пространство за всеки арт формат, това е интериорът на нашия Най-новият ресторант в София.
                    </p>
                    
                    <button
                        className={styles.contactButton}
                        onClick={() => navigate('/contact')} // Use navigate function to redirect
                    >
                        Контакт
                    </button>

                </div>
            </div>
        </section>
    );
}

export default AboutUs;
