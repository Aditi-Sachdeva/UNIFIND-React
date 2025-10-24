import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MobileInfoBoxes from '../../components/admin/MobileInfoBoxes';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const headings = [
    "Email",
    "Item Name",
    "Category",
    "Description",
    "Date & Time",
    "Location",
    "Status",
    "Contact",
    "Image",
    "Actions",
  ];

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error.message);
        toast.error('Failed to load reports');
      } else {
        setReports(data);
        setFilteredReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete report');
    } else {
      toast.success('Report deleted');
      setReports((prev) => prev.filter((r) => r.id !== id));
      setFilteredReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = reports.filter((r) => {
      const matchesCategory = selectedCategory === '' || r.category === selectedCategory;
      const matchesSearch =
        r.item_name?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term) ||
        r.contact_info?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    setFilteredReports(filtered);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-48 mt-5 lg:ml-64 p-4 space-y-6">
          <MobileInfoBoxes />

          <div className="w-full flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center items-center text-center mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings..."
                className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 w-full sm:w-72 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700"
              >
                <option value="">All Categories</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Others</option>
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition"
              >
                Search
              </button>
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition">
                Verify Items
              </button>
            </div>
          </div>

          {/* Table container grows naturally, scrolls only when needed */}
          <div className="overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-blue-600 text-white sticky top-0 z-10">
                <tr>
                  {headings.map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={headings.length}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headings.length}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No reports found
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100 break-words max-w-[200px]">
                        {report.profiles?.email || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.item_name}</td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.category}</td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.description}</td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">
                        {new Date(report.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.location}</td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.status || "—"}</td>
                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.contact_info}</td>
                      <td className="px-4 py-4">
                        {report.image_url ? (
                          <img
                            src={report.image_url}
                            alt="Report"
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}







