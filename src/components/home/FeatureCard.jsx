function FeatureCard({ title, description }) {
  return (
    <div className=" bg-gray-300 md:bg-gray-200 dark:bg-gray-800 text-center rounded-lg p-6 shadow-md border border-gray-300 w-full md:w-1/3 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-gray-300 dark:hover:bg-gray-700 hover:shadow-blue-500/50 h-auto md:h-32">
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default FeatureCard;