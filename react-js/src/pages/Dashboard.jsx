import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <Link to="/users">User List</Link>
    </div>
  );
}

export default Dashboard;
