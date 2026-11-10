// PhotoGallery.jsx
import styles from './PhotoGallery.module.css';
import photo2 from '../assets/images/galleryImg1.jpg';
import photo3 from '../assets/images/galleryImg2.jpg';
import photo4 from '../assets/images/galleryImg3.jpg';
import photo5 from '../assets/images/opt/galleryImg4.jpg';

const photos = [
    { src: photo5, w: 1000, h: 668, alt: "Зала с жълти дивани, тъмносини стени и кръгли маси" },
    { src: photo2, w: 583, h: 490, alt: "Зала с меки кресла и панорамни прозорци" },
    { src: photo3, w: 583, h: 490, alt: "Светла зала с дървени маси и сини столове" },
    { src: photo4, w: 583, h: 490, alt: "Сепаре с медни стени и дълга маса" },
];

function PhotoGallery() {
    return (
        <section className={styles.gallery} aria-labelledby="gallery-title">
            <div className={styles.inner}>
                <h2 id="gallery-title" className={styles.title}>Снимки на нашите ресторанти</h2>
                <ul className={styles.galleryContainer}>
                    {photos.map((photo) => (
                        <li key={photo.src} className={styles.item}>
                            <img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} loading="lazy" />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default PhotoGallery;
