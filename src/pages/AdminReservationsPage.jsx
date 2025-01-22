import React, { useState, useEffect } from "react";
import ReservationTable from "../components/ReservationTable";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/reservations");
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        console.error("Failed to fetch reservations", err);
      }
    };
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/admin/reservations/${id}`, {
        method: "DELETE",
      });
      setReservations((prev) => prev.filter((res) => res._id !== id));
    } catch (err) {
      console.error("Failed to delete reservation", err);
    }
  };

  const handleEdit = (id) => {
    alert("Edit functionality not implemented yet.");
  };

  return (
    <div>
      <ReservationTable
        reservations={reservations}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
}
