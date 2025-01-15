// HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import photo1 from '../assets/images/img1Car.jpg'; // Hero Image
import AboutUs from './AboutUs'; // Import AboutUs section
import PhotoGallery from './PhotoGallery'; // Import PhotoGallery section
import Location from './Location'; // Import Location section

export function HomePage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    // Show Scroll to Top button when scrolling down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={styles.homepage}>
            {/* Static Hero Section */}
            <header className={styles.hero}>
                <img src={photo1} alt="Hero" className={styles.heroImage} />
                <div className={styles.overlay}>
                    <h1>Welcome to ChefConnect</h1>
                    <p>Experience culinary excellence in every bite.</p>
                    <button
                        className={styles.menuButton}
                        onClick={() => navigate('/products')}
                    >
                        Go to Menu
                    </button>
                </div>
            </header>

            {/* About Us Section */}
            <AboutUs />

            {/* Photo Gallery Section */}
            <PhotoGallery />

            {/* Location Section */}
            <Location />

            {/* Scroll to Top Button */}
            {isVisible && (
                <button
                    className={styles.scrollToTop}
                    onClick={scrollToTop}
                >
                    ↑
                </button>
            )}

            {/* Footer Section */}
            <footer className={styles.footer}>
                <p>© 2024 ChefConnect. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
