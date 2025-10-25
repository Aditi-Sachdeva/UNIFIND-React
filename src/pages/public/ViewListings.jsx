import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import Filters from '../../components/common/Filters';
import { toast } from 'react-hot-toast';

const ViewListings = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;

      let query = supabase.from('reports').select('*').eq('user_id', user.id);

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.category) query = query.eq('category', filters.category);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        const filtered = filters.search
          ? data.filter((r) =>
              r.item_name.toLowerCase().includes(filters.search.toLowerCase())
            )
          : data;
        setReports(filtered);
      }

      setLoading(false);
    };

    fetchReports();
  }, [user, filters]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this report?');
    if (!confirm) return;

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete report');
    } else {
      toast.success('Report deleted');
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEdit = (report) => {
    toast('Edit functionality coming soon!');
    // You can redirect to /edit/:id or open a modal here
  };

  return (
    <div className="font-sans bg-white dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col md:min-h-[calc(100vh-64px)] md:overflow-hidden">
      <main className="p-4 md:p-6 flex-1">
        <h1 className="text-center text-xl md:text-3xl font-bold text-blue-500 mb-6">
          My Reports
        </h1>

        <Filters onFilter={setFilters} />

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700 rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Item Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date & Time</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Contact Info</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-2">{report.item_name}</td>
                    <td className="px-4 py-2">{report.category}</td>
                    <td className="px-4 py-2">{report.description}</td>
                    <td className="px-4 py-2">
                      {report.date_time
                        .replace('T', ' ')      // Replace T with space
                        .replace('+00', '')     // Remove timezone
                        .slice(0, 16)}          
                    </td>
                    <td className="px-4 py-2">{report.location}</td>
                    <td className="px-4 py-2">{report.status}</td>
                    <td className="px-4 py-2">{report.contact_info}</td>
                    <td className="px-4 py-2">
                      {report.image_url ? (
                        <img
                          src={report.image_url}
                          alt="Report"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(report)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="text-red-500 hover:underline"
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
  );
};

export default ViewListings;