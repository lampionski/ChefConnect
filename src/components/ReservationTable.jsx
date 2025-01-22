import React from "react";
import styles from "../pages/ReservationsPage.module.css";


export default function ReservationTable({ reservations, handleDelete, handleEdit }) {
  return (
    <div className={styles.tableContainer}>
      <h2>Reservations</h2>
      <table>
        <thead>
          <tr>
            <th>Table</th>
            <th>User</th>
            <th>Date</th>
            <th>Hour</th>
            <th>People</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res._id}>
              <td>{res.table.number}</td>
              <td>{res.user.fullname}</td>
              <td>{new Date(res.date).toLocaleDateString()}</td>
              <td>{res.startHour}:00</td>
              <td>{res.people}</td>
              <td>
                <button onClick={() => handleEdit(res._id)}>Edit</button>
                <button onClick={() => handleDelete(res._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
