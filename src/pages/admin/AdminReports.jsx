// import React, { useEffect, useState } from "react";
// import supabase from "../../supabaseClient";
// import { toast } from "react-hot-toast";
// import AdminNavbar from "../../components/admin/AdminNavbar";
// import AdminSidebar from "../../components/admin/AdminSidebar";
// import { getImageEmbedding, cosineSimilarity } from "../../utils/clarifai";

// export default function AdminReports() {
//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const headings = [
//     "Email",
//     "Item Name",
//     "Category",
//     "Description",
//     "Date & Time",
//     "Location",
//     "Status",
//     "Contact",
//     "Image",
//     "Actions",
//   ];

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("reports")
//       .select("*, profiles(email)")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Error fetching reports:", error.message);
//       toast.error("Failed to load reports");
//     } else {
//       setReports(data || []);
//       setFilteredReports(data || []);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     const { error } = await supabase.from("reports").delete().eq("id", id);
//     if (error) {
//       toast.error("Failed to delete report");
//     } else {
//       toast.success("Report deleted");
//       setReports((prev) => prev.filter((r) => r.id !== id));
//       setFilteredReports((prev) => prev.filter((r) => r.id !== id));
//     }
//   };

//   const handleSearch = () => {
//     const term = searchTerm.toLowerCase();
//     const filtered = reports.filter((r) => {
//       const matchesCategory =
//         !selectedCategory || r.category === selectedCategory;
//       const matchesSearch =
//         r.item_name?.toLowerCase().includes(term) ||
//         r.location?.toLowerCase().includes(term) ||
//         r.contact_info?.toLowerCase().includes(term);
//       return matchesCategory && matchesSearch;
//     });
//     setFilteredReports(filtered);
//   };

//   const normalize = (str) => str?.toLowerCase().trim() || "";

//   const fuzzyMatch = (a, b) => {
//     const normA = normalize(a);
//     const normB = normalize(b);
//     return normA && normB && (normA.includes(normB) || normB.includes(normA));
//   };

//   const keywordMatch = (a, b) => {
//     const keywordsA = normalize(a).split(/\s+/);
//     const keywordsB = normalize(b).split(/\s+/);
//     const common = keywordsA.filter((word) => keywordsB.includes(word));
//     return common.length >= 2;
//   };

//   const verifyMatches = async () => {
//     const loadingToast = toast.loading("Verifying matches...");

//     try {
//       const verified = [];
//       const lostReports = reports.filter((r) => r.status === "Lost");
//       const foundReports = reports.filter((r) => r.status === "Found");

//       for (const lost of lostReports) {
//         for (const found of foundReports) {
//           let matchScore = 0;

//           if (fuzzyMatch(lost.item_name, found.item_name)) matchScore++;
//           if (fuzzyMatch(lost.category, found.category)) matchScore++;
//           if (keywordMatch(lost.description, found.description)) matchScore++;
//           if (fuzzyMatch(lost.location, found.location)) matchScore++;

//           const hasImages = lost.image_url && found.image_url;
//           let imageMatched = false;

//           if (hasImages && matchScore > 3) {
//             try {
//               const [lostEmbedding, foundEmbedding] = await Promise.all([
//                 getImageEmbedding(lost.image_url),
//                 getImageEmbedding(found.image_url),
//               ]);

//               if (lostEmbedding && foundEmbedding) {
//                 const similarity = cosineSimilarity(lostEmbedding, foundEmbedding);
//                 if (similarity >= 0.85) {
//                   matchScore++;
//                   imageMatched = true;
//                 }
//               }
//             } catch (imgErr) {
//               console.warn("Image similarity error:", imgErr);
//             }
//           }

//           const shouldInsert =
//             (!hasImages && matchScore >= 4) ||
//             (hasImages && imageMatched && matchScore >= 4);

//           if (shouldInsert) {
//             const { data: existing, error: checkError } = await supabase
//               .from("verified_reports")
//               .select("id")
//               .eq("lost_id", lost.id)
//               .eq("found_id", found.id)
//               .maybeSingle();

//             if (checkError && checkError.code !== "PGRST116") {
//               console.error("Error checking existing match:", checkError.message);
//               continue;
//             }

//             if (!existing) {
//               const { error: insertError } = await supabase
//                 .from("verified_reports")
//                 .insert({
//                   lost_id: lost.id,
//                   found_id: found.id,
//                   verified_at: new Date().toISOString(),
//                   match_score: matchScore,
//                   lost_email: lost.profiles?.email || null,
//                   found_email: found.profiles?.email || null,
//                 });

//               if (!insertError) {
//                 verified.push({ lost_id: lost.id, found_id: found.id });
//               }
//             }
//           }
//         }
//       }

//       toast.dismiss(loadingToast);
//       verified.length > 0
//         ? toast.success("Reports Verified Successfully!")
//         : toast.error("No Verified Reports Found.");
//     } catch (err) {
//       console.error("Error in verifyMatches:", err);
//       toast.dismiss(loadingToast);
//       toast.error("Something went wrong while verifying reports.");
//     }
//   };

//   return (
//     <div className="bg-gray-200 dark:bg-gray-900 min-h-screen">
//       <AdminNavbar />
//       <div className="flex flex-col lg:flex-row">
//         {/* Sidebar */}
//         <div className="hidden lg:block">
//           <AdminSidebar />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 mt-5 p-4 lg:ml-64 space-y-6">
//           {/* Search & Controls */}
//           <div className="w-full flex flex-row flex-wrap gap-3 justify-center items-center mb-4 overflow-x-auto">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search listings..."
//               className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 sm:w-[300px] outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
//             />

//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 w-36 sm:w-40 flex-shrink-0"
//             >
//               <option value="">All Categories</option>
//               <option>Electronics</option>
//               <option>Accessories</option>
//               <option>Books</option>
//               <option>Clothing</option>
//               <option>Footwear</option>
//               <option>Bags & Wallets</option>
//               <option>Stationery</option>
//               <option>ID & Access Cards</option>
//               <option>Documents</option>
//               <option>Keys</option>
//               <option>Eyewear</option>
//               <option>Sports & Gym Gear</option>
//               <option>Water Bottles & Drinkware</option>
//               <option>Others</option>
//             </select>

//             <button
//               onClick={handleSearch}
//               className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition flex-shrink-0"
//             >
//               Search
//             </button>

//             <button
//               onClick={verifyMatches}
//               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition flex-shrink-0 ml-2"
//             >
//               Verify Items
//             </button>
//           </div>

//           {/* Table */}
//           <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-w-full lg:max-w-[1200px] mx-auto">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-blue-600 text-white sticky top-0 z-10">
//                 <tr>
//                   {headings.map((heading) => (
//                     <th key={heading} className="px-6 py-3 font-semibold">
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-700">
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan={headings.length}
//                       className="text-center py-6 text-gray-500 dark:text-gray-400"
//                     >
//                       Loading reports...
//                     </td>
//                   </tr>
//                 ) : filteredReports.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={headings.length}
//                       className="text-center py-6 text-gray-500 dark:text-gray-400"
//                     >
//                       No reports found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredReports.map((report) => (
//                     <tr
//                       key={report.id}
//                       className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//                     >
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100 break-all">
//                         {report.profiles?.email || "—"}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {report.item_name}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {report.category}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {report.description}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {new Date(report.created_at).toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {report.location}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {report.status}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
//                         {report.contact_info}
//                       </td>
//                       <td className="px-6 py-4">
//                         {report.image_url ? (
//                           <img
//                             src={report.image_url}
//                             alt="Report"
//                             className="h-10 w-10 object-cover rounded-md border border-gray-300 dark:border-gray-600"
//                           />
//                         ) : (
//                           <span className="text-gray-400">—</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleDelete(report.id)}
//                           className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card Layout */}
//           <div className="md:hidden flex flex-col gap-4">
//             {loading ? (
//               <p className="text-center text-gray-500 dark:text-gray-400">
//                 Loading reports...
//               </p>
//             ) : filteredReports.length === 0 ? (
//               <p className="text-center text-gray-500 dark:text-gray-400">
//                 No reports found.
//               </p>
//             ) : (
//               filteredReports.map((report) => (
//                 <div
//                   key={report.id}
//                   className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-sm"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                       {report.item_name}
//                     </h3>
//                     <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
//                       {report.status}
//                     </span>
//                   </div>
//                   <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
//                     <strong>Category:</strong> {report.category}
//                   </p>
//                   <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
//                     <strong>Location:</strong> {report.location}
//                   </p>
//                   <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
//                     <strong>Contact:</strong> {report.contact_info}
//                   </p>
//                   {report.image_url && (
//                     <img
//                       src={report.image_url}
//                       alt="Report"
//                       className="w-full h-40 object-cover rounded-md mt-2"
//                     />
//                   )}
//                   <div className="flex justify-end mt-3">
//                     <button
//                       onClick={() => handleDelete(report.id)}
//                       className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { toast } from "react-hot-toast";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getImageEmbedding, cosineSimilarity } from "../../utils/clarifai";

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
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error.message);
      toast.error("Failed to load reports");
    } else {
      setReports(data || []);
      setFilteredReports(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

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
        !selectedCategory || r.category === selectedCategory;
      const matchesSearch =
        r.item_name?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term) ||
        r.contact_info?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    setFilteredReports(filtered);
  };

  const normalize = (str) => str?.toLowerCase().trim() || "";

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
    const loadingToast = toast.loading("Verifying matches...");

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
            try {
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
            } catch (imgErr) {
              console.warn("Image similarity error:", imgErr);
            }
          }

          const shouldInsert =
            (!hasImages && matchScore >= 4) ||
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

            if (!existing) {
              const { error: insertError } = await supabase
                .from("verified_reports")
                .insert({
                  lost_id: lost.id,
                  found_id: found.id,
                  verified_at: new Date().toISOString(),
                  match_score: matchScore,
                  lost_email: lost.profiles?.email || null,
                  found_email: found.profiles?.email || null,
                });

              if (!insertError) {
                verified.push({ lost_id: lost.id, found_id: found.id });
              }
            }
          }
        }
      }

      toast.dismiss(loadingToast);
      verified.length > 0
        ? toast.success("Reports Verified Successfully!")
        : toast.error("No Verified Reports Found.");
    } catch (err) {
      console.error("Error in verifyMatches:", err);
      toast.dismiss(loadingToast);
      toast.error("Something went wrong while verifying reports.");
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        <main className="flex-1 mt-5 p-4 lg:ml-64 space-y-6">
          {/* Search & Controls */}
          <div className="w-full flex flex-row flex-wrap gap-3 justify-center items-center mb-4 overflow-x-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 sm:w-[300px] outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            />

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
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition flex-shrink-0 ml-2"
            >
              Verify Items
            </button>
          </div>

          {/* ✅ Fixed Table Section */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-w-full lg:max-w-[1200px] mx-auto">
            <table className="min-w-full text-sm text-left table-auto">
              <thead className="bg-blue-600 text-white sticky top-0 z-10">
                <tr>
                  {headings.map((heading) => (
                    <th
                      key={heading}
                      className={`px-6 py-3 font-semibold ${
                        heading === "Email" ? "text-left w-[250px]" : "text-center"
                      }`}
                    >
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
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-left truncate max-w-[250px]">
                        {report.profiles?.email || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-center">
                        {report.item_name}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-center">
                        {report.category}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-left truncate max-w-[250px]">
                        {report.description}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-center">
                        {new Date(report.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-center">
                        {report.location}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-center">
                        {report.status}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 text-center">
                        {report.contact_info}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {report.image_url ? (
                          <img
                            src={report.image_url}
                            alt="Report"
                            className="h-10 w-10 object-cover rounded-md border border-gray-300 dark:border-gray-600 mx-auto"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
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

          {/* Mobile Card Layout */}
          <div className="md:hidden flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Loading reports...
              </p>
            ) : filteredReports.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No reports found.
              </p>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {report.item_name}
                    </h3>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
                    <strong>Category:</strong> {report.category}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
                    <strong>Location:</strong> {report.location}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
                    <strong>Contact:</strong> {report.contact_info}
                  </p>
                  {report.image_url && (
                    <img
                      src={report.image_url}
                      alt="Report"
                      className="w-full h-40 object-cover rounded-md mt-2"
                    />
                  )}
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
