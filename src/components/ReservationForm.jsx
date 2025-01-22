import React, { useState, useEffect } from "react";
import styles from "../pages/ReservationsPage.module.css";

export default function ReservationForm({ userId }) {
  const [availableTables, setAvailableTables] = useState([]);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [people, setPeople] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const fetchAvailableTables = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/tables/available?date=${date}&startHour=${hour}&people=${people}`
      );
      const data = await response.json();
      setAvailableTables(data);
    } catch (err) {
      console.error("Failed to fetch available tables:", err);
    }
  };

  const handleReserve = async () => {
    if (!selectedTable) {
      alert("Please select a table.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tableId: selectedTable,
          date,
          startHour: hour,
          people,
        }),
      });

      if (response.ok) {
        alert("Reservation created successfully!");
      } else {
        alert("Failed to create reservation.");
      }
    } catch (err) {
      console.error("Failed to create reservation", err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Make a Reservation</h2>
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Hour:
        <input type="number" min="0" max="23" value={hour} onChange={(e) => setHour(e.target.value)} />
      </label>
      <label>
        People:
        <input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} />
      </label>
      <button onClick={fetchAvailableTables}>Check Available Tables</button>
      <div>
        {availableTables.length > 0 ? (
          <ul>
            {availableTables.map((table) => (
              <li key={table._id}>
                <input
                  type="radio"
                  id={`table-${table.number}`}
                  name="table"
                  value={table._id}
                  onChange={() => setSelectedTable(table._id)}
                />
                <label htmlFor={`table-${table.number}`}>
                  Table {table.number} (Capacity: {table.capacity})
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tables available for the selected time.</p>
        )}
      </div>
      <button onClick={handleReserve}>Reserve</button>
    </div>
  );
}
