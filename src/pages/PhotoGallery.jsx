// PhotoGallery.jsx
import React from 'react';
import styles from './PhotoGallery.module.css';
import photo2 from '../assets/images/galleryImg1.jpg'; 
import photo3 from '../assets/images/galleryImg2.jpg'; 
import photo4 from '../assets/images/galleryImg3.jpg'; 


function PhotoGallery() {
    return (
        <section className={styles.gallery}>
            <h2>Снимки на нашите ресторнти</h2>
            <div className={styles.galleryContainer}>
                <img src={photo2} alt="Dish 1" />
                <img src={photo3} alt="Dish 2" />
                <img src={photo4} alt="Interior 1" />
            </div>
        </section>
    );
}

export default PhotoGallery;
