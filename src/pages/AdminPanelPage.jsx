import React from "react";

const AdminDashboard = ({ handleLogout }) => {
  return (
    <div className="admin-dashboard">
      <h2>Welcome to the Admin Dashboard</h2>
      <div className="dashboard-options">
        <button onClick={() => alert("Manage Menu clicked")}>Manage Menu</button>
        <button onClick={() => alert("View Profits clicked")}>View Profits</button>
        <button onClick={() => alert("Manage Workers clicked")}>Manage Workers</button>
        <button onClick={() => alert("Manage Reservations clicked")}>Manage Reservations</button>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
