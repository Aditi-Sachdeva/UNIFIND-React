// src/pages/public/ReportItem.jsx
import Navbar from '../../components/layout/Navbar';
import ReportItemForm from '../../components/forms/ReportItemForm';

export default function ReportItem({ user }) {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 min-h-screen flex flex-col md:min-h-[calc(100vh-64px)] ">
      {/* Form container takes remaining height after navbar */}
      <div className="flex-1 flex justify-center items-center px-4 overflow-hidden">
        <ReportItemForm user={user} />
      </div>
    </div>
  );
}