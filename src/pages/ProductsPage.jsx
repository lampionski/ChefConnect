import { useState, useEffect } from "react";
import classes from "./ProductsPage.module.css";

export default function ProductsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(""); // State for selected category

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/get-menu${category ? `?category=${category}` : ""}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu items.");
        }
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMenu();
  }, [category]); // Re-fetch when category changes

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
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
      <div className={classes.filterContainer}>
        <label htmlFor="category">Filter by category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={classes.categoryDropdown}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {menuItems.length === 0 ? (
        <p>No items available in this category.</p>
      ) : (
        <ul className={classes.menuList}>
          {menuItems.map((item) => (
            <li key={item._id} className={classes.menuItem}>
              <img
                src={item.image} // Image URL here
                alt={item.name}
                className={classes.menuItemImage}
              />
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
