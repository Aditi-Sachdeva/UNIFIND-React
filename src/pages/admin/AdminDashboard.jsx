import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatsCard from "../../components/admin/StatsCard";
import VerifiedReportsTable from "../../components/admin/VerifiedReportsTable";

export default function AdminDashboard() {
  const [totalReports, setTotalReports] = useState(0);
  const [verifiedReportsCount, setVerifiedReportsCount] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [verifiedReports, setVerifiedReports] = useState([]);
  const [loadingVerified, setLoadingVerified] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: total, error: totalError } = await supabase
        .from("reports")
        .select("*", { count: "exact", head: true });

      const { count: verified, error: verifiedError } = await supabase
        .from("verified_reports")
        .select("*", { count: "exact", head: true });

      if (totalError || verifiedError) {
        console.error("Error fetching stats:", totalError || verifiedError);
      } else {
        const resolvedItems = verified * 2; // Each verified report resolves both lost and found
        setTotalReports(total);
        setVerifiedReportsCount(resolvedItems);
        setPendingReports(total - resolvedItems);
      }
    };

    fetchStats();
    fetchVerifiedReports();
  }, []);

  const fetchVerifiedReports = async () => {
    setLoadingVerified(true);
    const { data, error } = await supabase
      .from("verified_reports")
      .select(`
        id,
        verified_at,
        status,
        lost_email,
        found_email,
        lost:reports!verified_reports_lost_id_fkey (
          item_name, category, location, contact_info, image_url
        ),
        found:reports!verified_reports_found_id_fkey (
          item_name, category, location, contact_info, image_url
        )
      `);

    if (error) {
      console.error("Error fetching verified reports:", error.message);
    } else {
      const formatted = data.map((report) => ({
        ...report,
        verified_at_local: report.verified_at
          ? new Date(report.verified_at).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: true,
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
      }));
      setVerifiedReports(formatted);
    }
    setLoadingVerified(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar hidden on mobile */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        <main className="flex-1 lg:ml-64 p-4 space-y-6 w-full overflow-y-auto">
          {/* Mobile Info Boxes */}

          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-4">
            {/* Total Reports */}
            <div
              className="transition transform hover:scale-105 active:scale-105 focus:scale-105 
              rounded-2xl shadow-md hover:shadow-xl active:shadow-xl 
              hover:bg-blue-50 dark:hover:bg-blue-950 
              active:bg-blue-100 dark:active:bg-blue-900 
              focus:bg-blue-100 dark:focus:bg-blue-900 cursor-pointer"
            >
              <StatsCard label="Total Reports" value={totalReports} color="blue" />
            </div>

            {/* Resolved Reports */}
            <div
              className="transition transform hover:scale-105 active:scale-105 focus:scale-105 
              rounded-2xl shadow-md hover:shadow-xl active:shadow-xl 
              hover:bg-green-50 dark:hover:bg-green-950 
              active:bg-green-100 dark:active:bg-green-900 
              focus:bg-green-100 dark:focus:bg-green-900 cursor-pointer"
            >
              <StatsCard label="Resolved Items" value={verifiedReportsCount} color="green" />
            </div>

            {/* Pending Reports */}
            <div
              className="transition transform hover:scale-105 active:scale-105 focus:scale-105 
              rounded-2xl shadow-md hover:shadow-xl active:shadow-xl 
              hover:bg-red-50 dark:hover:bg-red-950 
              active:bg-red-100 dark:active:bg-red-900 
              focus:bg-red-100 dark:focus:bg-red-900 cursor-pointer"
            >
              <StatsCard label="Pending Reports" value={pendingReports} color="red" />
            </div>
          </div>

          {/* Verified Reports Table */}
          <div className="w-full">
            <VerifiedReportsTable
              reports={verifiedReports}
              loading={loadingVerified}
              refreshReports={fetchVerifiedReports}
              buttonSpacing // adds space between “Send Email” and “Mark as Returned”
            />
          </div>
        </main>
      </div>
    </div>
  );
}

