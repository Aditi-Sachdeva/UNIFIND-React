


import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MobileInfoBoxes from '../../components/admin/MobileInfoBoxes';
import VerifiedReportsTable from '../../components/admin/VerifiedReportsTable';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [verifiedReports, setVerifiedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVerified, setLoadingVerified] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const headings = [
    "Email", "Item Name", "Category", "Description", "Date & Time",
    "Location", "Status", "Contact", "Image", "Actions"
  ];

  useEffect(() => {
    fetchReports();
    fetchVerifiedReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select(`*, profiles (email)`)
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

  const fetchVerifiedReports = async () => {
  setLoadingVerified(true);
  const { data, error } = await supabase
    .from('verified_reports')
    .select(`
      id,
      verified_at,
      lost:reports!verified_reports_lost_id_fkey (
        item_name, category, location, contact_info, image_url
      ),
      found:reports!verified_reports_found_id_fkey (
        item_name, category, location, contact_info, image_url
      )
    `);

  if (error) {
    console.error('Error fetching verified reports:', error.message);
  } else {
    setVerifiedReports(data);
  }
  setLoadingVerified(false);
};


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
        r.location?.toLowerCase().includes(term) ||
        r.contact_info?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    setFilteredReports(filtered);
  };

const normalize = (str) => str?.toLowerCase().trim();

const verifyMatches = async () => {
  console.log(' Verify button clicked');
  toast.loading('Verifying matches...');

  try {
    const verified = [];

    // Step 1: Filter lost and found reports
    const lostReports = reports.filter((r) => r.status === 'Lost');
    const foundReports = reports.filter((r) => r.status === 'Found');

    console.log(`📦 Found ${lostReports.length} lost reports`);
    console.log(`📦 Found ${foundReports.length} found reports`);

    // Step 2: Compare each lost–found pair
    for (const lost of lostReports) {
      for (const found of foundReports) {
        console.log('🔍 Comparing pair:', {
          lost: {
            id: lost.id,
            item_name: lost.item_name,
            category: lost.category,
            location: lost.location,
            description: lost.description,
          },
          found: {
            id: found.id,
            item_name: found.item_name,
            category: found.category,
            location: found.location,
            description: found.description,
          },
        });

        const metadataMatch =
          normalize(lost.item_name) === normalize(found.item_name) &&
          normalize(lost.category) === normalize(found.category) &&
          normalize(lost.location) === normalize(found.location) &&
          normalize(lost.description) === normalize(found.description);

        console.log(`🧠 Metadata match: ${metadataMatch}`);

        if (metadataMatch) {
          // Step 3: Check if match already exists
          const { data: existing, error: checkError } = await supabase
            .from('verified_reports')
            .select('id')
            .eq('lost_id', lost.id)
            .eq('found_id', found.id)
            .maybeSingle();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('❌ Error checking existing match:', checkError.message);
            continue;
          }

          if (existing) {
            console.log('⚠️ Match already exists, skipping insert');
          } else {
            // Step 4: Insert verified match
            const { error: insertError } = await supabase.from('verified_reports').insert({
              lost_id: lost.id,
              found_id: found.id,
              verified_at: new Date().toISOString(),
            });

            if (insertError) {
              console.error('❌ Insert failed:', insertError.message);
            } else {
              console.log('✅ Match inserted:', { lost_id: lost.id, found_id: found.id });
              toast.success(`Verified: ${lost.item_name}`);
              verified.push({ lost_id: lost.id, found_id: found.id });
            }
          }
        }
      }
    }

    // Step 5: Final feedback
    if (verified.length === 0) {
      console.log('🚫 No matches found');
      toast('No matches found');
    } else {
      console.log(`🎉 Total verified matches inserted: ${verified.length}`);
    }

    // Step 6: Refresh verified reports
    console.log('🔄 Refreshing verified reports...');
    await fetchVerifiedReports();
  } catch (err) {
    console.error('❌ Error in verifyMatches:', err);
    toast.error('Something went wrong');
  } finally {
    toast.dismiss();
    console.log('🧹 Verification process complete');
  }
};






  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-48 mt-5 lg:ml-64 p-4 space-y-6">
          <MobileInfoBoxes />

          {/* Search + Verify Controls */}
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
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition"
              >
                Search
              </button>
              <button
                onClick={verifyMatches}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition"
              >
                Verify Items
              </button>
            </div>
          </div>

          {/* Reports Table */}
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
                    <td colSpan={headings.length} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={headings.length} className="text-center py-6 text-gray-500 dark:text-gray-400">
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
                      



                      <td className="px-4 py-4 text-gray-800 dark:text-gray-100">{report.contact_info}</td>
                     


                     



<td className="px-4 py-4">
  {report.image_url ? (
    <img
      src={report.image_url}
      alt="Report"
      className="h-10 w-10 object-cover rounded"
    />
  ) : (
    <span className="text-gray-500 dark:text-gray-400">—</span>
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