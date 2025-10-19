import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Filters from '../../components/common/Filters';

const ViewListings = () => {
  return (
    <div className="font-sans bg-white dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col">
      <Navbar />

      <main className="p-4 md:p-6 flex-1">
        <h1 className="text-center text-xl md:text-3xl font-bold text-blue-600 mb-6">
          My Reports
        </h1>

        <Filters />

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Item Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Contact Info</th>
                <th className="px-4 py-2 text-left">Image</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <td colSpan="8" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No reports found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ViewListings;