// Location.jsx
import React from 'react';
import styles from './Location.module.css';

const Location = () => {
    return (
        <section className={styles.location}>
            <h2>Посетете ни</h2>
            <p>булевард Княз Борис I. 66, Варна, BG 9000</p> {/* Updated address */}
            <div className={styles.mapContainer}>
                <iframe
                    title="Restaurant Location"
                    src="https://www.google.com/maps/embed/v1/place?q=Kniaz+Boris+I+Blvd.+66,+Varna,+BG+9000&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
}

export default Location;
