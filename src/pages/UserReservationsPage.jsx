import React from "react";
import ReservationForm from "../components/ReservationForm";

export default function UserReservationsPage({ userId }) {
  return (
    <div>
      <ReservationForm userId={userId} />
    </div>
  );
}
