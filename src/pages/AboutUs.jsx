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
                    <h2>For Godzila</h2>
                    <p>
                        Back in 1999, the first GODZILA restaurant was opened in Varna. 
                        For 20 years, we have had 5 restaurants and won the trust of our 
                        guests with varied and modern cuisine, non-standard portions, 
                        attractive prices, and excellent service.
                    </p>
                    <p>
                        Elegant. Provocative. Artistic. Bright, with a feeling of infinity. 
                        Modern, but with a human face. The place where in peace and comfort 
                        you can eat deliciously and escape for a while from the big city. 
                        A wonderful space for any art format, this is the interior of our 
                        newest restaurant in Sofia.
                    </p>
                    
                    <button
                        className={styles.contactButton}
                        onClick={() => navigate('/contact')} // Use navigate function to redirect
                    >
                        Contacts
                    </button>

                </div>
            </div>
        </section>
    );
}

export default AboutUs;
