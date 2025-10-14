// src/pages/public/ReportItem.jsx
import Navbar from '../../components/layout/Navbar';
import ReportItemForm from '../../components/forms/ReportItemForm';

export default function ReportItem() {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 min-h-screen">
      <Navbar />
      <ReportItemForm />
    </div>
  );
}