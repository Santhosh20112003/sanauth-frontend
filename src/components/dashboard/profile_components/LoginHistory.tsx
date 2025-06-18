import React, { useState, useEffect } from 'react';
import {
  RiLoader4Line, RiSearchLine, RiFilterLine, RiArrowLeftSLine,
  RiArrowRightSLine, RiInformationLine, RiCloseLine
} from 'react-icons/ri';
import { useUserAuth } from '../../context/UserAuthContext';

// Interface for login session data from API
interface LoginSession {
  loginTime: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  status: string; // "SUCCESS", "FAILED", "UNVERIFIED"
}

interface LoginHistoryProps {
  standalone?: boolean;
}

const LoginHistory: React.FC<LoginHistoryProps> = ({ standalone = false }) => {
  // Login history state
  const [loginHistory, setLoginHistory] = useState<LoginSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getLoginSessions } = useUserAuth();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [startTimeFilter, setStartTimeFilter] = useState<string>('00:00');
  const [endTimeFilter, setEndTimeFilter] = useState<string>('23:59');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDateFilter('');
    setStartTimeFilter('00:00');
    setEndTimeFilter('23:59');
    setCurrentPage(1);
  };

  // Fetch login sessions from API
  useEffect(() => {
    fetchLoginSessions();
    // Return cleanup function to ensure state is reset when component unmounts
    return () => {
      setLoginHistory([]);
      setFilteredSessions([]);
      resetFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters when data or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [loginHistory, searchTerm, statusFilter, dateFilter, startTimeFilter, endTimeFilter]);

  // Update total pages when filtered sessions change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredSessions.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredSessions, itemsPerPage]);

  const fetchLoginSessions = async () => {
    setLoading(true);
    setError(null);
    
    // Reset filters before fetching new data
    resetFilters();

    try {
      const response = await getLoginSessions();
      setLoginHistory(response.data);
      setFilteredSessions(response.data);
      
      // Set default filter to the most recent date with login activity
      if (response.data && response.data.length > 0) {
        // Sort the login sessions by date (newest first)
        const sortedSessions = [...response.data].sort((a, b) => 
          new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime()
        );
        
        // Get the most recent date and format it as YYYY-MM-DD for the date input
        const mostRecentDate = new Date(sortedSessions[0].loginTime);
        const year = mostRecentDate.getFullYear();
        const month = String(mostRecentDate.getMonth() + 1).padStart(2, '0');
        const day = String(mostRecentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        // Set the default filter to most recent date from the response
        setDateFilter(formattedDate);
      }
    } catch (error) {
      console.error('Error fetching login sessions:', error);
      setError('Failed to load login history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...loginHistory];

    // Apply search
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        session =>
          session.deviceInfo.toLowerCase().includes(lowercaseSearch) ||
          session.ipAddress.toLowerCase().includes(lowercaseSearch) ||
          session.location.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(session => session.status === statusFilter);
    }

    // Apply date and time filter if specified
    if (dateFilter) {
      // Create date objects for start and end of the filtered time range
      const filterDateStr = dateFilter; // "YYYY-MM-DD"
      
      // Parse time strings
      const [startHours, startMinutes] = startTimeFilter.split(':').map(Number);
      const [endHours, endMinutes] = endTimeFilter.split(':').map(Number);
      
      // Create start and end datetime objects
      const startDateTime = new Date(filterDateStr);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
      
      const endDateTime = new Date(filterDateStr);
      endDateTime.setHours(endHours, endMinutes, 59, 999);
      
      result = result.filter(session => {
        const sessionDate = new Date(session.loginTime);
        return sessionDate >= startDateTime && sessionDate <= endDateTime;
      });
    }

    setFilteredSessions(result);
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSessions.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Next and previous page handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format date with error handling
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className={`${standalone ? 'p-6 max-w-6xl mx-auto' : ''}`}>
      {standalone && <h1 className="text-2xl font-bold text-gray-800 mb-6">Login History</h1>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Login History
            {dateFilter && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                (Showing entries from {new Date(dateFilter).toLocaleDateString()} {startTimeFilter} to {endTimeFilter})
              </span>
            )}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex items-center hover:bg-gray-50"
            >
              <RiFilterLine className="mr-1" />
              Filter
              {(statusFilter !== 'ALL' || dateFilter) &&
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
              }
            </button>
            <button
              onClick={fetchLoginSessions}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex items-center hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by device, IP address or location..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
            />
          </div>

          {isFilterOpen && (
            <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Filters</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Successful</option>
                    <option value="FAILED">Failed</option>
                    <option value="UNVERIFIED">Unverified</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="dateFilter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  />
                </div>
                
                <div>
                  <label htmlFor="startTimeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTimeFilter"
                    value={startTimeFilter}
                    onChange={(e) => setStartTimeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  />
                </div>

                <div>
                  <label htmlFor="endTimeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTimeFilter"
                    value={endTimeFilter}
                    onChange={(e) => setEndTimeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67c6ff]/30 focus:border-[#67c6ff]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <RiLoader4Line className="animate-spin h-8 w-8 text-[#67c6ff]" />
            <span className="ml-2 text-gray-500">Loading login history...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            <div className="flex">
              <RiInformationLine className="h-5 w-5 text-red-400 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No login sessions match your criteria.</p>
            {dateFilter && (
              <button 
                onClick={resetFilters} 
                className="mt-2 text-[#67c6ff] hover:underline"
              >
                Clear filters to see all sessions
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((login, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(login.loginTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{login.deviceInfo}</div>
                        <div className="text-xs text-gray-500">IP: {login.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {login.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {login.status === 'SUCCESS' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                            Successful
                          </span>
                        ) : login.status === 'FAILED' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Unverified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSessions.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredSessions.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredSessions.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">Previous</span>
                        <RiArrowLeftSLine className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      {[...Array(totalPages).keys()].map(number => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number + 1
                            ? 'z-10 bg-[#67c6ff] border-[#67c6ff] text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {number + 1}
                        </button>
                      ))}

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">Next</span>
                        <RiArrowRightSLine className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <RiInformationLine className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Security note</h3>
              <p className="text-sm text-yellow-700 mt-1">
                If you see any suspicious login attempts, please change your password immediately and contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHistory;
