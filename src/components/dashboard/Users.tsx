import { useEffect, useState } from "react";
import request from "../config/axios_config";
import { 
  RiSearch2Line, RiFilterLine, RiAddLine, RiMore2Line, RiArrowLeftSLine, 
  RiArrowRightSLine, RiUserSettingsLine, RiLockLine, RiDeleteBinLine, 
  RiUserLine
} from "react-icons/ri";

function Users() {
  const [users, setUsers] = useState([{
    uid: "",
    email: "",
    name: "",
    photoURL: "",
    role: "",
    createdAt: "",
    lastLogin: "",
    active: false
  }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New states for enhanced functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const usersPerPage = 9;

  // User statistics
  const userStats = {
    total: users.length,
    active: users.filter(user => user.active).length,
    admins: users.filter(user => user.role === "ADMIN").length,
    new: users.filter(user => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(user.createdAt) > oneWeekAgo;
    }).length
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
                          (filterStatus === "active" && user.active) || 
                          (filterStatus === "inactive" && !user.active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginate users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Toggle user selection
  const toggleUserSelection = (uid: string) => {
    setSelectedUsers(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implement the actual API calls here
    setSelectedUsers([]);
  };

  // Toggle dropdown menu
  const toggleDropdown = (uid: string) => {
    setShowDropdown(prev => prev === uid ? null : uid);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await request.get('/api/users/get/all');
        setUsers(response.data);
        console.log("Fetched users:", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error in Users component:", error);
        setLoading(false);
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with stats */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Users Management</h1>
        <p className="text-gray-600">Manage your application users and their permissions</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#67c6ff]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>Failed to load users: {error}</p>
        </div>
      ) : (
        <>
          {/* User Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-800">{userStats.total}</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">All</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Active Users</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-800">{userStats.active}</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {Math.round((userStats.active / userStats.total) * 100)}%
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Administrators</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-800">{userStats.admins}</span>
                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {Math.round((userStats.admins / userStats.total) * 100)}%
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">New Users (7d)</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-800">{userStats.new}</span>
                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {Math.round((userStats.new / userStats.total) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex flex-wrap gap-3 justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff] w-full md:w-64"
                  />
                  <RiSearch2Line className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                {/* Role Filter */}
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-4 pr-10 py-2 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  >
                    <option value="all">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                  <RiFilterLine className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-4 pr-10 py-2 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <RiFilterLine className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex gap-3">
                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <div className="flex gap-2">
                    <span className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {selectedUsers.length} selected
                    </span>
                    <button 
                      onClick={() => handleBulkAction('activate')}
                      className="py-2 px-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      Activate
                    </button>
                    <button 
                      onClick={() => handleBulkAction('deactivate')}
                      className="py-2 px-3 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
                    >
                      Deactivate
                    </button>
                    <button 
                      onClick={() => handleBulkAction('delete')}
                      className="py-2 px-3 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
                
                {/* Add User Button */}
                <button className="px-4 py-2 bg-[#67c6ff] text-white rounded-lg flex items-center gap-2 hover:bg-[#57b6ff]">
                  <RiAddLine /> Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-[#67c6ff] rounded border-gray-300 focus:ring-[#67c6ff]"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(currentUsers.map(user => user.uid));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        checked={currentUsers.length > 0 && selectedUsers.length === currentUsers.length}
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map(user => (
                    <tr key={user.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-[#67c6ff] rounded border-gray-300 focus:ring-[#67c6ff]"
                          checked={selectedUsers.includes(user.uid)}
                          onChange={() => toggleUserSelection(user.uid)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#67c6ff]/10 flex items-center justify-center mr-4">
                              <span className="text-sm font-medium text-[#67c6ff]">{user?.name?.charAt(0) || user?.email?.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user?.name || "No name"}</div>
                            <div className="text-sm text-gray-500 line-clamp-1 break-all">{user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                           user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' : 
                           'bg-gray-100 text-gray-800'}`}>
                          {user?.role || "Not assigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user?.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button onClick={() => toggleDropdown(user.uid)} className="text-gray-400 hover:text-gray-600">
                            <RiMore2Line className="h-5 w-5" />
                          </button>
                          
                          {showDropdown === user.uid && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1">
                                <button onClick={() => console.log('Edit user', user.uid)} className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100">
                                  <RiUserSettingsLine className="mr-2" /> Edit User
                                </button>
                                <button onClick={() => console.log('Reset password', user.uid)} className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100">
                                  <RiLockLine className="mr-2" /> Reset Password
                                </button>
                                <button onClick={() => console.log('Delete user', user.uid)} className="flex items-center px-4 py-2 text-sm text-red-600 w-full text-left hover:bg-red-50">
                                  <RiDeleteBinLine className="mr-2" /> Delete User
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastUser, filteredUsers.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <RiArrowLeftSLine className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(totalPages).keys()].map(number => (
                        <button
                          key={number + 1}
                          onClick={() => setCurrentPage(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number + 1
                              ? 'z-10 bg-[#67c6ff]/10 border-[#67c6ff] text-[#67c6ff]'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <RiArrowRightSLine className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Empty state */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <RiUserLine className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No users match your current filters. Try adjusting your search or filters.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterRole("all");
                  setFilterStatus("all");
                }} 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#67c6ff] hover:bg-[#57b6ff]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Users;