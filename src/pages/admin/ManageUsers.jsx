import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { toast } from "react-hot-toast";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import MobileInfoBoxes from "../../components/admin/MobileInfoBoxes";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [loading, setLoading] = useState(true);

  const headings = ["ID", "Username", "Email", "Role", "Actions"];

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, role")
        .order("id", { ascending: true });

      if (error) {
        toast.error("Failed to load users");
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      const role = (user.role || "").toLowerCase().trim();
      const matchesRole =
        selectedRole === "All Roles" ||
        selectedRole === "" ||
        role === selectedRole.toLowerCase().trim();
      const matchesSearch =
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete user");
    } else {
      toast.success("User deleted");
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole?.toLowerCase() === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success(
        `Role changed to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`
      );
      const updated = users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      );
      setUsers(updated);
      setFilteredUsers(updated);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        <main className="flex-1 lg:ml-64 p-4 space-y-6 w-full">
          <MobileInfoBoxes />

          {/* Filters */}
          <div className="w-full flex justify-center">
            <div
              className="
                flex flex-wrap justify-center items-center text-center mb-2 
                gap-2 sm:gap-2 
                [@media(max-width:640px)]:gap-4
              "
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700 w-full sm:w-72 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md border border-gray-300 dark:border-gray-700"
              >
                <option value="All Roles">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 max-w-full lg:max-w-[1200px] mx-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-blue-600 text-white sticky top-0 z-10">
                <tr>
                  {headings.map((heading) => (
                    <th key={heading} className="px-6 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={headings.length}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headings.length}
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 break-all">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                        {user.username || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-100 break-all">
                        {user.email || "—"}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          user.role?.toLowerCase() === "admin"
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {user.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : "—"}
                      </td>
                      <td className="px-6 py-4 flex gap-3 flex-wrap">
                        <button
                          onClick={() =>
                            handleToggleRole(user.id, user.role)
                          }
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition"
                        >
                          {user.role?.toLowerCase() === "admin"
                            ? "Make User"
                            : "Make Admin"}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (ID Removed, Buttons in One Line) */}
          <div className="md:hidden flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Loading users...
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {user.username || "Unnamed User"}
                    </h3>
                    <span
                      className={`text-sm font-medium ${
                        user.role?.toLowerCase() === "admin"
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {user.role
                        ? user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)
                        : "—"}
                    </span>
                  </div>

                  {/* ID removed on mobile */}

                  <p className="text-gray-700 dark:text-gray-300 text-sm break-all">
                    <strong>Email:</strong> {user.email || "—"}
                  </p>

                  {/* Buttons in one line on mobile */}
                  <div className="flex flex-row justify-between items-center mt-3 gap-3">
                    <button
                      onClick={() => handleToggleRole(user.id, user.role)}
                      className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition whitespace-nowrap"
                    >
                      {user.role?.toLowerCase() === "admin"
                        ? "Make User"
                        : "Make Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
