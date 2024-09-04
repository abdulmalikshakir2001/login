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
} from "react-icons/md"; // Added MdVerifiedUser and MdSecurity for nested routes

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
    path: "user-management",
    icon: <MdGroup className="h-6 w-6" />, // User Management Icon
    component: <NFTMarketplace />, // Parent Component for User Management
    secondary: true,
    children: [
      {
        name: "Roles",
        layout: "/admin",
        path: "roles",
        icon: <MdVerifiedUser className="h-6 w-6" />, // Icon for Roles
        component: <NFTMarketplace />, // Replace with actual component for Roles
      },
      {
        name: "Permissions",
        layout: "/admin",
        path: "permissions",
        icon: <MdSecurity className="h-6 w-6" />, // Icon for Permissions
        component: <NFTMarketplace />, // Replace with actual component for Permissions
      },
      {
        name: "Users",
        layout: "/admin",
        path: "users",
        icon: <MdPerson className="h-6 w-6" />, // Icon for Users
        component: <NFTMarketplace />, // Replace with actual component for Users
      },
    ],
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
