

import React from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Sidebar from '../../components/admin/Sidebar'; 

const users = [
  { id: 18, name: 'Aditi', email: 'aditi@gmail.com', role: 'Admin' },
  { id: 66, name: 'Ayush', email: 'ayush@gmail.com', role: 'Admin' },
  { id: 56, name: 'ABC', email: 'abc@gmail.com', role: 'User' },
];

const UserTable = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
    <table className="w-full border-collapse text-sm sm:text-base">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-3 sm:px-4 py-2 text-left">ID</th>
          <th className="px-3 sm:px-4 py-2 text-left">Name</th>
          <th className="px-3 sm:px-4 py-2 text-left">Email</th>
          <th className="px-3 sm:px-4 py-2 text-left">Role</th>
          <th className="px-3 sm:px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {users.map(user => (
          <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <td className="px-3 sm:px-4 py-2">{user.id}</td>
            <td className="px-3 sm:px-4 py-2">{user.name}</td>
            <td className="px-3 sm:px-4 py-2">{user.email}</td>
            <td
              className={`px-3 sm:px-4 py-2 font-semibold ${
                user.role === 'Admin'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {user.role}
            </td>
            <td className="px-3 sm:px-4 py-2 flex gap-3">
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">✏</button>
              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">🗑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminPanel = () => (
  <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <Sidebar /> {/* ✅ Using imported Sidebar */}
    <main className="flex-1 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Users</h2>
      <UserTable />
    </main>
  </div>
);

export default AdminPanel;

