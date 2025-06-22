import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiUser3Line, RiSettings4Line, RiLogoutBoxRLine, RiArrowDownSLine, RiNotification3Line } from "react-icons/ri";
import { GoOrganization } from "react-icons/go";
import { useUserAuth } from "../context/UserAuthContext";


function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, SignOut } = useUserAuth();

  const organizations = [
    { id: 1, name: "My Organization", logo: "MO" },
    { id: 2, name: "Personal Projects", logo: "PP" },
    { id: 3, name: "Client Work", logo: "CW" }
  ];

  const [selectedOrg, setSelectedOrg] = useState(organizations[0]);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const notifications = [
    { id: 1, message: "New user registered", time: "2 min ago", read: false },
    { id: 2, message: "Authentication service updated", time: "1 hour ago", read: false },
    { id: 3, message: "Weekly report is ready", time: "Yesterday", read: true },
    { id: 4, message: "Security alert detected", time: "2 days ago", read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Add refs for tracking dropdowns
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Add refs for tracking dropdown toggle buttons
  const orgButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const userButtonRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Organization dropdown
      if (
        isOrgDropdownOpen &&
        orgDropdownRef.current &&
        !orgDropdownRef.current.contains(event.target as Node) &&
        orgButtonRef.current &&
        !orgButtonRef.current.contains(event.target as Node)
      ) {
        setIsOrgDropdownOpen(false);
      }

      // Notifications dropdown
      if (
        isNotificationsOpen &&
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }

      // User dropdown
      if (
        isDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOrgDropdownOpen, isNotificationsOpen, isDropdownOpen]);

  return (
    <nav className="bg-[#20bfef] border-b border-gray-200 shadow-sm h-16">
      <div className="h-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Left section - Logo & Organization */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <div className="bg-white px-3 py-1.5 rounded-md shadow-sm flex items-center gap-2">
                  <img
                    src="https://ik.imagekit.io/vituepzjm/SanAuth/SanAuth.svg?updatedAt=1749400779754"
                    alt="SANAUTH"
                    className="h-7 w-7"
                  />
                  <span className="font-bold text-[#696969] text-lg">SanAuth</span>
                </div>
              </Link>
            </div>

            {/* Organization Selector - Display in navbar */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <button
                  ref={orgButtonRef}
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 border border-white/30 text-white"
                >
                  <div className="w-7 h-7 rounded-md bg-white/90 flex items-center justify-center text-[#67c6ff] font-medium text-sm shadow-sm">
                    {selectedOrg.logo}
                  </div>
                  <span className="text-sm font-medium text-white truncate max-w-[150px]">
                    {selectedOrg.name}
                  </span>
                  <RiArrowDownSLine className={`text-white transition-transform duration-200 ${isOrgDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOrgDropdownOpen && (
                  <div
                    ref={orgDropdownRef}
                    className="absolute z-10 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-xl animate-fadeIn"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700">Select Organization</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto py-2">
                      {organizations.map(org => (
                        <button
                          key={org.id}
                          onClick={() => {
                            setSelectedOrg(org);
                            setIsOrgDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors ${selectedOrg.id === org.id ? 'bg-gray-50' : ''}`}
                        >
                          <div className="w-7 h-7 rounded-md bg-[#67c6ff] flex items-center justify-center text-white font-medium text-sm">
                            {org.logo}
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700">{org.name}</span>
                          {selectedOrg.id === org.id && (
                            <svg className="w-4 h-4 ml-auto text-[#67c6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#67c6ff] hover:bg-[#67c6ff]/5 transition-colors rounded-md text-sm font-medium">
                        <GoOrganization className="text-[#67c6ff]" />
                        <span>Create Organization</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right section - User dropdown */}
          <div className="flex items-center space-x-5">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-[#696969] rounded-lg transition-colors shadow-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">New App</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                ref={notificationsButtonRef}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="flex items-center justify-center group p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors border border-white/30 text-white"
              >
                <RiNotification3Line className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-3.5 bg-red-400 rounded-full border-2 border-white text-white text-xs flex items-center justify-center">
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div
                  ref={notificationsDropdownRef}
                  className="origin-top-right z-30 absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white border border-gray-200 overflow-hidden animate-fadeIn"
                >
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-medium text-gray-800">Notifications</h3>
                    <button className="text-xs text-[#67c6ff] hover:text-[#4dabea] transition-colors font-medium">
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">
                        <div className="flex justify-center mb-3">
                          <RiNotification3Line className="w-10 h-10 text-gray-300" />
                        </div>
                        <p>No new notifications</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notification.read ? 'bg-[#67c6ff]' : 'bg-gray-300'}`}></div>
                            <div className="ml-3 flex-grow">
                              <p className={`text-sm ${!notification.read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-sm text-[#67c6ff] hover:text-[#4dabea] transition-colors font-medium"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div
                ref={userButtonRef}
                onClick={toggleDropdown}
                className="flex items-center active:scale-95 transition-all cursor-pointer gap-2"
              >
                <div className="size-9 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/150"}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {isDropdownOpen && (
                <div
                  ref={userDropdownRef}
                  className="origin-top-right z-30 absolute right-0 mt-4 min-w-56 w-auto rounded-lg shadow-xl bg-white border border-gray-300 
                  animate-fadeIn transition-all duration-200 transform animate-dropdown"
                  style={{animation: "dropdownAnimation 0.25s ease-out forwards"}}
                >
                  <div className="absolute -top-1.5 rounded-tl-xs border-t right-3 size-3 rotate-45 bg-gray-100 border-l border-gray-300"></div>


                  {/* Menu items */}
                  <div className="">
                    <div className="bg-gray-100 rounded-t-lg">
                      <div className="flex flex-col items-center px-5 py-5 border-b border-gray-100">
                        <div className="size-12 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm">
                          <img
                            src={user.photoURL || "https://via.placeholder.com/150"}
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-center mt-2">
                          <p className="text-sm font-medium text-gray-800">{user.name || "User Name"}</p>
                          <p className="text-xs text-gray-500">{user.email || ""}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/dashboard/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={toggleDropdown}
                    >
                      <RiUser3Line className="w-4 h-4 mr-3 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={toggleDropdown}
                    >
                      <RiSettings4Line className="w-4 h-4 mr-3 text-gray-500" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 "></div>
                    <button
                      onClick={() => {
                        toggleDropdown();
                        SignOut();
                      }}
                      className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <RiLogoutBoxRLine className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;