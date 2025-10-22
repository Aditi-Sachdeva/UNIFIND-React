// src/pages/admin/AdminReports.jsx
import React from "react";

const AdminReports = () => {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Search bar, buttons, etc. */}
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-950 rounded-lg shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-blue-600 dark:bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              {["Email", "Item Name", "Category", "Description", "Date & Time", "Location", "Status", "Contact Info", "Image", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td colSpan="10" className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-800">
                No reports found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminReports;