import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  const linkBase = "block px-4 py-2 rounded-lg shadow-md font-medium";
  const activeClass = "bg-blue-600 text-white";
  const inactiveClass = "dark:text-gray-300 hover:bg-blue-600 hover:text-white";

  return (
    <aside className="hidden md:block md:w-48 lg:w-64 bg-white dark:bg-gray-900 p-6 border-r border-gray-200 dark:border-gray-700 shadow-lg h-full fixed top-16 left-0 z-40">
      <h2 className="text-lg font-semibold text-blue-500 dark:text-blue-400 mb-4 tracking-wide">
        Admin Panel
      </h2>
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Manage Users
        </NavLink>
        <NavLink
          to="/admin/AdminReports"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Manage Reports
        </NavLink>
      </nav>
    </aside>
  );
}






