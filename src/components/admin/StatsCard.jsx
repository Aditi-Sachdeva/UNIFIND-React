export default function StatCard({ label, value, color, shadow }) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400"
  };

  const shadowClasses = {
    blue: "hover:shadow-[0_4px_12px_#60A5FA]",
    green: "hover:shadow-[0_4px_12px_#34D399]",
    red: "hover:shadow-[0_4px_12px_#F87171]"
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 p-6 rounded-lg text-center border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 ${shadowClasses[color]}`}
    >
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}

