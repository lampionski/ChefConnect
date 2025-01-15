import { useState, useEffect } from "react";
import classes from "./ProductsPage.module.css";

export default function ProductsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/menu")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch menu items.");
        }
        return response.json();
      })
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className={classes.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={classes.error}>{error}</p>;
  }

  return (
    <div className={classes.container}>
      <h2>Product List</h2>
      {menuItems.length === 0 ? (
        <p>The menu is currently empty.</p>
      ) : (
        <ul className={classes.menuList}>
          {menuItems.map((item) => (
            <li key={item._id} className={classes.menuItem}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
