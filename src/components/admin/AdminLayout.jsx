import React from "react";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;