import React from 'react';

const Filters = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-5 text-[15px]">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by item name"
        className="px-2.5 py-1.5 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 w-full md:w-60 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Category Dropdown */}
      <select className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 rounded-md w-full md:w-auto">
        <option>All Categories</option>
        <option>Electronics</option>
        <option>Books</option>
        <option>Clothing</option>
        <option>Accessories</option>
      </select>

      {/* Status Dropdown */}
      <select className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 rounded-md w-full md:w-auto">
        <option>All Status</option>
        <option>Lost</option>
        <option>Found</option>
        <option>Claimed</option>
      </select>

      {/* Search Button */}
      <button className="bg-blue-600 hover:bg-blue-800 px-4 py-1.5 rounded-md w-full md:w-auto text-white font-medium transition">
        Search
      </button>
    </div>
  );
};

export default Filters;