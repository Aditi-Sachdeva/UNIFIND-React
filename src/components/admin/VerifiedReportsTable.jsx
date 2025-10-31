import React, { useState } from "react";
import supabase from "../../supabaseClient";
import { sendMatchEmail } from "../../utils/sendEmail";

function VerifiedReportsTable({ reports, loading, refreshReports }) {
  const [sending, setSending] = useState({});

  const handleSendEmail = async (match) => {
    const { lost_email, found_email, lost, found, id } = match;
    const itemName = lost?.item_name || found?.item_name || "an item";

    setSending((prev) => ({ ...prev, [id]: true }));

    await sendMatchEmail(lost_email, found_email, itemName);

    const { error } = await supabase
      .from("verified_reports")
      .update({ email_sent: true })
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating email_sent:", error.message);
    } else {
      refreshReports(); // Refresh to get updated email_sent status
    }

    setSending((prev) => ({ ...prev, [id]: false }));
  };

  const renderCheckbox = (match) => (
    <div
      className={`h-4 w-4 rounded-sm border-2 flex items-center justify-center ${
        match.email_sent ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
      }`}
    >
      {match.email_sent && (
        <span className="text-white text-xs font-bold leading-none">✓</span>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
      <p className="flex justify-center font-semibold text-lg text-blue-600 dark:text-blue-400 mb-2">
        Verified Reports
      </p>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading verified reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No verified reports found</p>
        ) : (
          reports.map((match) => (
            <div
              key={match.id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
            >
              <p><span className="font-semibold">Item:</span> {match.lost?.item_name}</p>
              <p><span className="font-semibold">Category:</span> {match.lost?.category}</p>
              <p><span className="font-semibold">Location:</span> {match.lost?.location}</p>
              <p><span className="font-semibold">Verified At:</span> {match.verified_at_local}</p>
              <p><span className="font-semibold">Lost Email:</span> {match.lost_email}</p>
              <p><span className="font-semibold">Found Email:</span> {match.found_email}</p>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleSendEmail(match)}
                  disabled={match.email_sent || sending[match.id]}
                  className={`text-blue-600 underline ${
                    match.email_sent ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Send Email
                </button>
                {renderCheckbox(match)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white text-sm">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Verified At</th>
              <th className="px-4 py-2">Lost Email</th>
              <th className="px-4 py-2">Found Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 dark:text-gray-400 py-4">
                  Loading verified reports...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No verified reports found
                </td>
              </tr>
            ) : (
              reports.map((match) => (
                <tr key={match.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost?.item_name}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost?.category}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost?.location}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.verified_at_local}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.lost_email}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{match.found_email}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <button
                      onClick={() => handleSendEmail(match)}
                      disabled={match.email_sent || sending[match.id]}
                      className={`text-blue-600 hover:underline ${
                        match.email_sent ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Send Email
                    </button>
                    {renderCheckbox(match)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VerifiedReportsTable;