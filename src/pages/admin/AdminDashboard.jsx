import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import MobileInfoBoxes from '../../components/admin/MobileInfoBoxes';
import StatsCard from '../../components/admin/StatsCard';
import VerifiedReportsTable from '../../components/admin/VerifiedReportsTable';

export default function AdminDashboard() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Sticky Navbar */}
      <AdminNavbar />

      {/* Layout */}
      <div className="flex">
        {/* Fixed Sidebar */}
        <AdminSidebar />

        {/* Scrollable Main Content */}
        <main
          className="flex-1 ml-48 lg:ml-64 h-[calc(100vh-64px)] overflow-y-auto p-4 space-y-6"
        >
          {/* Mobile Info Boxes */}
          <MobileInfoBoxes />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatsCard label="Total Reports" value={0} color="blue" />
            <StatsCard label="Resolved Cases" value={0} color="green" />
            <StatsCard label="Pending Reports" value={0} color="red" />
          </div>

          {/* Verified Reports Table */}
          <VerifiedReportsTable />
        </main>
      </div>
    </div>
  );
}