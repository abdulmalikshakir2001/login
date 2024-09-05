import React from "react";
import { Routes, Route } from "react-router-dom";
// Import actual components for Roles, Permissions, and Users
import Roles from "./Roles"; 
import Permissions from "./Permissions";
import Users from "./Users";

const NFTMarketplace = () => {
  return (
    <div>
      <h1>User Management</h1>
      <Routes>
        <Route path="roles" element={<Roles />} />
        <Route path="permissions" element={<Permissions />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </div>
  );
};

export default NFTMarketplace;
