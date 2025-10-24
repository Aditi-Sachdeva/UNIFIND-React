

import React from 'react';

function VerifiedReportsTable({ reports, loading }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <p className="flex justify-center font-semibold text-lg text-blue-600 dark:text-blue-400 mb-2">
        Verified Reports
      </p>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading verified reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No verified reports found</p>
        ) : (
          reports.map((match) => (
            <div
              key={match.id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
            >
              <p><span className="font-semibold">Item:</span> {match.lost?.item_name} → {match.found?.item_name}</p>
              <p><span className="font-semibold">Category:</span> {match.lost?.category}</p>
              <p><span className="font-semibold">Location:</span> {match.lost?.location}</p>
              <p><span className="font-semibold">Verified At:</span> {new Date(match.verified_at).toLocaleString()}</p>
              <p><span className="font-semibold">Contact:</span> {match.found?.contact_info}</p>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white text-sm">
            <tr>
              <th className="px-4 py-2">Lost Item</th>
              <th className="px-4 py-2">Found Item</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Verified At</th>
              <th className="px-4 py-2">Contact</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Loading verified reports...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No verified reports found
                </td>
              </tr>
            ) : (
              reports.map((match) => (
                <tr key={match.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost?.item_name}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.found?.item_name}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost?.category}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost?.location}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{new Date(match.verified_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.found?.contact_info}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VerifiedReportsTable;

