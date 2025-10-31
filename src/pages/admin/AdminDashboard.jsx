import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import VerifiedReportsTable from '../../components/admin/VerifiedReportsTable';

export default function AdminDashboard() {
  const [totalReports, setTotalReports] = useState(0);
  const [verifiedReportsCount, setVerifiedReportsCount] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [verifiedReports, setVerifiedReports] = useState([]);
  const [loadingVerified, setLoadingVerified] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: total, error: totalError } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

      const { count: verified, error: verifiedError } = await supabase
        .from('verified_reports')
        .select('*', { count: 'exact', head: true });

      if (totalError || verifiedError) {
        console.error('Error fetching stats:', totalError || verifiedError);
      } else {
        const resolvedItems = verified * 2;
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
      .from('verified_reports')
      .select(`
        id,
        verified_at,
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
      console.error('Error fetching verified reports:', error.message);
    } else {
      const formatted = data.map((report) => ({
        ...report,
        verified_at_local: report.verified_at
          ? new Date(report.verified_at).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour12: true,
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—',
      }));
      setVerifiedReports(formatted);
    }
    setLoadingVerified(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="w-full md:w-64">
          <AdminSidebar />
        </div>
        <main className="flex-1 h-full overflow-y-auto p-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard label="Total Reports" value={totalReports} color="blue" />
            <StatsCard label="Resolved Items" value={verifiedReportsCount} color="green" />
            <StatsCard label="Pending Reports" value={pendingReports} color="red" />
          </div>

          <VerifiedReportsTable
            reports={verifiedReports}
            loading={loadingVerified}
            refreshReports={fetchVerifiedReports}
          />
        </main>
      </div>
    </div>
  );
}