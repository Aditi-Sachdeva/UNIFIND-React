import React, { useState, useEffect } from 'react';

const Filters = ({ onFilter }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    onFilter({ search, category, status });
  }, [search, category, status]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-5 text-[15px]">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by item name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-2.5 py-1.5 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 w-full md:w-60 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 rounded-md w-full md:w-auto"
      >
        <option value="">All Categories</option>
        <option>Electronics</option>
        <option>Accessories</option>
        <option>Books</option>
        <option>Clothing</option>
        <option>Footwear</option>
        <option>Bags & Wallets</option>
        <option>Stationery</option>
        <option>ID & Access Cards</option>
        <option>Documents</option>
        <option>Keys</option>
        <option>Eyewear</option>
        <option>Sports & Gym Gear</option>
        <option>Water Bottles & Drinkware</option>
        <option>Others</option>

      </select>

      {/* Status Dropdown */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 rounded-md w-full md:w-auto"
      >
        <option value="">All Status</option>
        <option>Lost</option>
        <option>Found</option>
       
      </select>
    </div>
  );
};

export default Filters;