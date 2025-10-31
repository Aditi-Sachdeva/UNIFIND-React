import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { toast } from "react-hot-toast";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageEmbedding, cosineSimilarity } from "./../../utils/clarifai";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error.message);
      toast.error("Failed to load reports");
    } else {
      setReports(data);
      setFilteredReports(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete report");
    } else {
      toast.success("Report deleted");
      setReports((prev) => prev.filter((r) => r.id !== id));
      setFilteredReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = reports.filter((r) => {
      const matchesCategory =
        selectedCategory === "" || r.category === selectedCategory;
      const matchesSearch =
        r.item_name?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term) ||
        r.contact_info?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    setFilteredReports(filtered);
  };

  const normalize = (str) => str?.toLowerCase().trim();

  const fuzzyMatch = (a, b) => {
    const normA = normalize(a);
    const normB = normalize(b);
    return normA && normB && (normA.includes(normB) || normB.includes(normA));
  };

  const keywordMatch = (a, b) => {
    const keywordsA = normalize(a).split(/\s+/);
    const keywordsB = normalize(b).split(/\s+/);
    const common = keywordsA.filter((word) => keywordsB.includes(word));
    return common.length >= 2;
  };

  const verifyMatches = async () => {
    toast.loading("Verifying matches...");

    try {
      const verified = [];
      const lostReports = reports.filter((r) => r.status === "Lost");
      const foundReports = reports.filter((r) => r.status === "Found");

      for (const lost of lostReports) {
        for (const found of foundReports) {
          let matchScore = 0;

          if (fuzzyMatch(lost.item_name, found.item_name)) matchScore++;
          if (fuzzyMatch(lost.category, found.category)) matchScore++;
          if (keywordMatch(lost.description, found.description)) matchScore++;
          if (fuzzyMatch(lost.location, found.location)) matchScore++;

          const hasImages = lost.image_url && found.image_url;
          let imageMatched = false;

          if (hasImages && matchScore > 3) {
            const [lostEmbedding, foundEmbedding] = await Promise.all([
              getImageEmbedding(lost.image_url),
              getImageEmbedding(found.image_url),
            ]);

            if (lostEmbedding && foundEmbedding) {
              const similarity = cosineSimilarity(lostEmbedding, foundEmbedding);
              if (similarity >= 0.85) {
                matchScore++;
                imageMatched = true;
              }
            }
          }

          const shouldInsert =
            (!hasImages && matchScore > 4) ||
            (hasImages && imageMatched && matchScore >= 4);

          if (shouldInsert) {
            const { data: existing, error: checkError } = await supabase
              .from("verified_reports")
              .select("id")
              .eq("lost_id", lost.id)
              .eq("found_id", found.id)
              .maybeSingle();

            if (checkError && checkError.code !== "PGRST116") {
              console.error("Error checking existing match:", checkError.message);
              continue;
            }

            if (!existing || Object.keys(existing).length === 0) {
              const { error: insertError } = await supabase
                .from("verified_reports")
                .insert({
                  lost_id: lost.id,
                  found_id: found.id,
                  verified_at: new Date().toISOString(),
                  match_score: matchScore,
                  lost_email: lost.profiles?.email || null,
                  found_email: found.profiles?.email || null,
                  status: "Pending",
                });

              if (!insertError) {
                verified.push({ lost_id: lost.id, found_id: found.id });
              }
            }
          }
        }
      }

      toast.dismiss();

      if (verified.length > 0) {
        toast.success("Reports Verified Successfully!");
      } else {
        toast.error("No Verified Reports Found.");
      }
    } catch (err) {
      console.error("Error in verifyMatches:", err);
      toast.dismiss();
      toast.error("Something went wrong while verifying reports.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 mt-5 p-4 lg:ml-64 space-y-6">
          {/* Search Bar */}
          <div className="w-full flex justify-center mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 w-[85%] sm:w-[500px] outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category + Buttons */}
          <div className="w-full flex flex-row flex-wrap gap-2 justify-center items-center mb-4 overflow-x-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 w-36 sm:w-40 flex-shrink-0"
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
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition flex-shrink-0"
            >
              Search
            </button>
            <button
              onClick={verifyMatches}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition flex-shrink-0 mr-2"
            >
              Verify Items
            </button>
          </div>

          {/* Table */}
          <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 mt-8">
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
              <tbody className="text-white divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={headings.length}
                      className="text-center py-6 text-gray-400"
                    >
                      Loading reports...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headings.length}
                      className="text-center py-6 text-gray-400"
                    >
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-800 transition">
                      <td className="px-4 py-4">{report.profiles?.email || "—"}</td>
                      <td className="px-4 py-4">{report.item_name}</td>
                      <td className="px-4 py-4">{report.category}</td>
                      <td className="px-4 py-4">{report.description}</td>
                      <td className="px-4 py-4">
                        {new Date(report.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">{report.location}</td>
                      <td className="px-4 py-4">{report.status}</td>
                      <td className="px-4 py-4">{report.contact_info}</td>
                      <td className="px-4 py-4">
                        {report.image_url ? (
                          <img
                            src={report.image_url}
                            alt="Report"
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
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

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-gray-800 rounded-lg shadow-md text-white space-y-2"
              >
                <p>
                  <span className="font-semibold">Item:</span> {report.item_name}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {report.category}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {report.status}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {report.location}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {report.contact_info}
                </p>
                {report.image_url && (
                  <img
                    src={report.image_url}
                    alt="Report"
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <button
                  onClick={() => handleDelete(report.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 mt-2 rounded-md text-white w-full"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
  