import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdGroup,
  MdBarChart,
  MdPerson,
  MdLock,
  MdVerifiedUser,
  MdSecurity,
} from "react-icons/md";
import Users from "views/admin/marketplace/Users";
import Role from "views/admin/marketplace/Roles";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "User Management",
    layout: "/admin",
    path: "user-management/*", // Updated to handle nested routes
    icon: <MdGroup className="h-6 w-6" />,
    component: <Users />, // Parent component for User Management
    secondary: true,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Users />, // Can be removed since nested in NFTMarketplace
  },
  {
    name: "Permissions",
    layout: "/admin",
    path: "permissions",
    icon: <MdSecurity className="h-6 w-6" />,
    component: <NFTMarketplace />, // Can be removed since nested in NFTMarketplace
  },
  {
    name: "Roles",
    layout: "/admin",
    path: "roles",
    icon: <MdVerifiedUser className="h-6 w-6" />,
    component: <Role />, // Can be removed since nested in NFTMarketplace
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
  },
];

export default routes;
