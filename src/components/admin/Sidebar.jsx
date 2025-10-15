import React from 'react';

export default function Sidebar() {
  return (
    <aside className="hidden md:block md:w-48 lg:w-64 bg-white dark:bg-gray-900 p-6 border-r border-gray-200 dark:border-gray-700 shadow-lg h-full">
      <h2 className="text-lg font-semibold text-blue-500 dark:text-blue-400 mb-4 tracking-wide">
        Admin Panel
      </h2>
      <nav className="space-y-2">
        <a
          href="#"
          className="block px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md"
        >
          Dashboard
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-300 shadow-md"
        >
          Manage Users
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-300 shadow-md"
        >
          Manage Reports
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-300 shadow-md"
        >
          Settings
        </a>
      </nav>
    </aside>
  );
}