import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa"
import { API_BASE_URL, menuImageSrc } from "../api"
import styles from "./ProductDetails.module.css"

export default function ProductDetails() {
  const { productID } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${API_BASE_URL}/get-menu`)
      .then((response) => { if (!response.ok) throw new Error("Менюто не е достъпно"); return response.json() })
      .then((items) => { const found = items.find((item) => item._id === productID); if (!found) throw new Error("Продуктът не е намерен"); setProduct(found) })
      .catch((err) => setError(err.message === "Failed to fetch" ? "Няма връзка със сървъра. Опитайте отново след малко." : err.message))
  }, [productID])

  return <div className="page">
    <Link to="/products" className="back-link"><FaArrowLeft aria-hidden="true" /> Към менюто</Link>
    {error ? <p className="notice notice--error" role="alert"><FaExclamationTriangle aria-hidden="true" /> {error}</p> : product ? <article className={styles.product}>
      <div className={styles.media}>
        <img className={styles.image} src={menuImageSrc(product.image) || "/placeholder.svg"} alt={product.name} />
      </div>
      <div className={styles.body}>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.description}>{product.description}</p>
        <dl className={styles.facts}>
          <div className={styles.priceRow}><dt>Цена</dt><dd>{product.price} лв.</dd></div>
          <div className={styles.metaRow}><dt>Категория</dt><dd>{product.category}</dd></div>
        </dl>
        <div className={styles.actions}>
          <Link to="/reservations" className="btn btn--primary">Запази маса</Link>
          <Link to="/products" className="btn btn--ghost">Обратно към менюто</Link>
        </div>
      </div>
    </article> : <p className="loader" role="status">Зарежда…</p>}
  </div>
}
