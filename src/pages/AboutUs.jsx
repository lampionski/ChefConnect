// AboutUs.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './AboutUs.module.css';
import photo1 from '../assets/images/aboutUs.jpg'; 

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
                    През далечната 1999 г. във Варна е открит първият ресторант ГОДЗИЛА. За 20 години имаме 5 ресторанта и спечелихме доверието на нашите гости с разнообразна и модерна кухня, атрактивни цени и отлично обслужване.
                    </p>
                    <p>
                    Елегантен. Провокативен. Артистичен. Светъл, с усещане за безкрайност. Модерен, но с човешки облик. Мястото, където в спокойствие и уют можеш да хапнеш вкусно и да избягаш за малко от големия град. Прекрасно пространство за всякакъв арт формат, това е интериора на най-новия ни ресторант в София.
                    </p>
                    <p>
                    Заповядайте и се убедете сами! </p>
                    
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
