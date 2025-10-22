// import AdminNavbar from '../../components/admin/AdminNavbar'
// import Sidebar from '../../components/admin/Sidebar'
// import MobileInfoBoxes from '../../components/admin/MobileInfoBoxes'
// import StatsCard from '../../components/admin/StatsCard'
// import VerifiedReportsTable from '../../components/admin/VerifiedReportsTable'

// function AdminDashboard() {
//   return (
//     <div className="bg-white dark:bg-gray-900 m-0 overflow-hidden min-h-screen">
//       <AdminNavbar />
      
//       {/* Layout */}
//       <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        
//         {/* Sidebar */}
//         <Sidebar />
        
//         {/* Main Content */}
//         <main className="flex-1 p-4 space-y-6 overflow-auto h-full">
          
//           {/* Mobile Info Boxes */}
//           <MobileInfoBoxes />
          
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <StatsCard 
//               label="Total Reports" 
//               value={0} 
//               color="blue" 
//             />
//             <StatsCard 
//               label="Resolved Cases" 
//               value={0} 
//               color="green" 
//             />
//             <StatsCard 
//               label="Pending Reports" 
//               value={0} 
//               color="red" 
//             />
//           </div>
          
//           {/* Verified Reports Table */}
//           <VerifiedReportsTable />
          
//         </main>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard






// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import MobileInfoBoxes from '../../components/admin/MobileInfoBoxes';
import StatsCard from '../../components/admin/StatsCard';
import VerifiedReportsTable from '../../components/admin/VerifiedReportsTable';

function AdminDashboard() {
  return (
    <>
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
    </>
  );
}

export default AdminDashboard;