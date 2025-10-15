function MobileInfoBoxes() {
  const labels = ['Admin Dashboard', 'Manage Users', 'Verified Reports']

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center md:hidden">
      {labels.map((label) => (
        <div
          key={label}
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-2 rounded-lg shadow-md"
        >
          {label}
        </div>
      ))}
    </div>
  )
}

export default MobileInfoBoxes