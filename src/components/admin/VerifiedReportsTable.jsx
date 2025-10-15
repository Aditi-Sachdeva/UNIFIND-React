function VerifiedReportsTable() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <p className="flex justify-center font-semibold text-lg text-blue-600 dark:text-blue-400 mb-2">
        Verified Reports
      </p>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
          <p><span className="font-semibold">ID:</span></p>
          <p><span className="font-semibold">Item:</span></p>
          <p><span className="font-semibold">Status:</span></p>
          <p><span className="font-semibold">User:</span></p>
          <p><span className="font-semibold">Verification Date:</span></p>
          <p><span className="font-semibold">Actions:</span></p>
          <p><span className="font-semibold">Mail:</span></p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            No verified reports found
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Verification Date</th>
              <th className="px-4 py-2">Actions</th>
              <th className="px-4 py-2">Mail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center text-gray-500 dark:text-gray-400 py-4">
                No verified reports found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerifiedReportsTable