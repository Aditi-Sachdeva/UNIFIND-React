

import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { toast } from "react-hot-toast";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import MobileInfoBoxes from "../../components/admin/MobileInfoBoxes";
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

  // const verifyMatches = async () => {
  //   toast.loading("Verifying matches...");

  //   try {
  //     const verified = [];
  //     const lostReports = reports.filter((r) => r.status === "Lost");
  //     const foundReports = reports.filter((r) => r.status === "Found");

  //     for (const lost of lostReports) {
  //       for (const found of foundReports) {
  //         let matchScore = 0;

  //         if (fuzzyMatch(lost.item_name, found.item_name)) matchScore++;
  //         if (fuzzyMatch(lost.category, found.category)) matchScore++;
  //         if (keywordMatch(lost.description, found.description)) matchScore++;
  //         if (fuzzyMatch(lost.location, found.location)) matchScore++;
  //         if (
  //           lost.image_url &&
  //           found.image_url &&
  //           normalize(lost.image_url) === normalize(found.image_url)
  //         )
  //           matchScore++;

  //         if (matchScore >= 3) {
  //           const { data: existing, error: checkError } = await supabase
  //             .from("verified_reports")
  //             .select("id")
  //             .eq("lost_id", lost.id)
  //             .eq("found_id", found.id)
  //             .maybeSingle();

  //           if (checkError && checkError.code !== "PGRST116") {
  //             console.error("Error checking existing match:", checkError.message);
  //             continue;
  //           }

  //           if (!existing) {
  //             const { error: insertError } = await supabase
  //               .from("verified_reports")
  //               .insert({
  //                 lost_id: lost.id,
  //                 found_id: found.id,
  //                 verified_at: new Date().toISOString(),
  //                 match_score: matchScore,
  //                 lost_email: lost.profiles?.email || null,
  //                 found_email: found.profiles?.email || null,
  //                 status: "Pending",
  //               });

  //             if (!insertError) {
  //               verified.push({ lost_id: lost.id, found_id: found.id });
  //             }
  //           }
  //         }
  //       }
  //     }

  //     toast.dismiss();

      
  //     if (verified.length > 0) {
  //       toast.success("Reports Verified Successfully!");
  //     } else {
  //       toast.error("No Verified Reports Found.");
  //     }
  //   } catch (err) {
  //     console.error("Error in verifyMatches:", err);
  //     toast.dismiss();
  //     toast.error("Something went wrong while verifying reports.");
  //   }
  // };


  


// const verifyMatches = async () => {
//   console.log("🔍 verifyMatches triggered");
//   toast.loading("Verifying matches...");

//   try {
//     const verified = [];

//     console.log("📦 Total reports:", reports.length);
//     const lostReports = reports.filter((r) => r.status === "Lost");
//     const foundReports = reports.filter((r) => r.status === "Found");

//     console.log(`🧭 Lost reports: ${lostReports.length}, Found reports: ${foundReports.length}`);

//     for (const lost of lostReports) {
//       for (const found of foundReports) {
//         let matchScore = 0;
//         console.log(`🔗 Comparing Lost #${lost.id} with Found #${found.id}`);

//         if (fuzzyMatch(lost.item_name, found.item_name)) {
//           matchScore++;
//           console.log("✅ Item name matched");
//         }

//         if (fuzzyMatch(lost.category, found.category)) {
//           matchScore++;
//           console.log("✅ Category matched");
//         }

//         if (keywordMatch(lost.description, found.description)) {
//           matchScore++;
//           console.log("✅ Description keywords matched");
//         }

//         if (fuzzyMatch(lost.location, found.location)) {
//           matchScore++;
//           console.log("✅ Location matched");
//         }

//         // 🧠 Clarifai image similarity — no URL comparison
//         if (lost.image_url && found.image_url) {
//           console.log("🖼️ Checking image similarity via Clarifai...");
//           const [lostEmbedding, foundEmbedding] = await Promise.all([
//             getImageEmbedding(lost.image_url),
//             getImageEmbedding(found.image_url),
//           ]);

//           if (lostEmbedding && foundEmbedding) {
//             const similarity = cosineSimilarity(lostEmbedding, foundEmbedding);
//             console.log(`📊 Image similarity score: ${similarity.toFixed(4)}`);

//             if (similarity >= 0.85) {
//               matchScore++;
//               console.log("✅ Image similarity passed threshold");
//             } else {
//               console.log("⚠️ Image similarity below threshold");
//             }
//           } else {
//             console.warn("⚠️ Missing embeddings for one or both images");
//           }
//         }

//         console.log(`🧮 Final match score: ${matchScore}`);

//         if (matchScore >= 3) {
//           const { data: existing, error: checkError } = await supabase
//             .from("verified_reports")
//             .select("id")
//             .eq("lost_id", lost.id)
//             .eq("found_id", found.id)
//             .maybeSingle();

//           if (checkError && checkError.code !== "PGRST116") {
//             console.error("❌ Error checking existing match:", checkError.message);
//             continue;
//           }

//           if (!existing) {
//             console.log("📥 Inserting new verified match...");
//             const { error: insertError } = await supabase
//               .from("verified_reports")
//               .insert({
//                 lost_id: lost.id,
//                 found_id: found.id,
//                 verified_at: new Date().toISOString(),
//                 match_score: matchScore,
//                 lost_email: lost.profiles?.email || null,
//                 found_email: found.profiles?.email || null,
//                 status: "Pending",
//               });

//             if (!insertError) {
//               console.log("✅ Match inserted successfully");
//               verified.push({ lost_id: lost.id, found_id: found.id });
//             } else {
//               console.error("❌ Insert error:", insertError.message);
//             }
//           } else {
//             console.log("⏩ Match already exists, skipping insert");
//           }
//         } else {
//           console.log("❌ Match score too low, skipping");
//         }
//       }
//     }

//     toast.dismiss();

//     if (verified.length > 0) {
//       console.log("🎉 Verified matches:", verified);
//       toast.success("Reports Verified Successfully!");
//     } else {
//       console.log("🚫 No matches verified");
//       toast.error("No Verified Reports Found.");
//     }
//   } catch (err) {
//     console.error("🔥 Error in verifyMatches:", err);
//     toast.dismiss();
//     toast.error("Something went wrong while verifying reports.");
//   }
// };



// const verifyMatches = async () => {
//     toast.loading("Verifying matches...");

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
//           if (lost.image_url && found.image_url) {
//   const [lostEmbedding, foundEmbedding] = await Promise.all([
//     getImageEmbedding(lost.image_url),
//     getImageEmbedding(found.image_url),
//   ]);

//   if (lostEmbedding && foundEmbedding) {
//     const similarity = cosineSimilarity(lostEmbedding, foundEmbedding);
//     if (similarity >= 0.85) {
//       matchScore++;
//     }
//   }
// }


//           if (matchScore >= 3) {
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
//                   status: "Pending",
//                 });

//               if (!insertError) {
//                 verified.push({ lost_id: lost.id, found_id: found.id });
//               }
//             }
//           }
//         }
//       }

//       toast.dismiss();

      
//       if (verified.length > 0) {
//         toast.success("Reports Verified Successfully!");
//       } else {
//         toast.error("No Verified Reports Found.");
//       }
//     } catch (err) {
//       console.error("Error in verifyMatches:", err);
//       toast.dismiss();
//       toast.error("Something went wrong while verifying reports.");
//     }
//   };



const verifyMatches = async () => {
  toast.loading("Verifying matches...");

  try {
    const verified = [];
    const lostReports = reports.filter((r) => r.status === "Lost");
    const foundReports = reports.filter((r) => r.status === "Found");

    for (const lost of lostReports) {
      for (const found of foundReports) {
        let matchScore = 0;

        // Step 1: Metadata matching
        if (fuzzyMatch(lost.item_name, found.item_name)) matchScore++;
        if (fuzzyMatch(lost.category, found.category)) matchScore++;
        if (keywordMatch(lost.description, found.description)) matchScore++;
        if (fuzzyMatch(lost.location, found.location)) matchScore++;

        const hasImages = lost.image_url && found.image_url;
        let imageMatched = false;

        // Step 2: If both images exist and metadata score ≥ 3, check image similarity
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

        // Step 3: Decide whether to insert
        const shouldInsert =
          (!hasImages && matchScore > 4) || (hasImages && imageMatched && matchScore >= 4);

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
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-48 mt-5 lg:ml-64 p-4 space-y-6">
          <MobileInfoBoxes />

          {/* Search and Verify Controls */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center items-center mb-4">
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
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900">
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
        </main>
      </div>
    </div>
  );
}
