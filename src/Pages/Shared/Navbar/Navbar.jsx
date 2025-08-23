import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard, MdAssignment, MdPeople, MdNotifications, MdSearch, MdAdd, MdAccountCircle, MdSettings, MdLogout } from "react-icons/md";
import { FaTasks, FaUser } from "react-icons/fa";
import { AuthContext } from "../../../provider/AuthProvider";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsProfileOpen(false);
      setIsNotificationOpen(false); // Close notification dropdown on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('Image failed to load:', user?.photoURL);
    setImageError(true);
  };



  


  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <FaTasks className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Fluentask</span>
            </Link>
          </div>

          {/* Center: Navigation - Equal spacing */}
          <nav className="flex flex-1 justify-center">
            <div className="flex space-x-8">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <MdDashboard className="w-4 h-4" />
                Home
              </Link>
               <Link to="/team" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <MdPeople className="w-4 h-4" />
                Team
              </Link>
              <Link to="/projects" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <FaTasks className="w-4 h-4" />
                Projects
              </Link>
              <Link to="/tasks" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <MdAssignment className="w-4 h-4" />
                Tasks
              </Link>
             
             
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Notifications - Only show when user is logged in */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <MdNotifications className="w-5 h-5 text-gray-600" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => setIsNotificationOpen(false)}
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {/* Sample Notifications */}
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">New task assigned to you</p>
                            <p className="text-xs text-gray-500 mt-1">Implement Task Management API - Due tomorrow</p>
                            <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">Task completed</p>
                            <p className="text-xs text-gray-500 mt-1">John Doe completed "Design User Authentication Flow"</p>
                            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">Deadline approaching</p>
                            <p className="text-xs text-gray-500 mt-1">Write Documentation - Due in 2 days</p>
                            <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">Team member joined</p>
                            <p className="text-xs text-gray-500 mt-1">Sarah Wilson joined your project team</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                      <button 
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.photoURL && !imageError ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {getInitials(user.displayName || user.email)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        {user.photoURL && !imageError ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {getInitials(user.displayName || user.email)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.displayName || user.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <MdAccountCircle className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <MdSettings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <MdLogout className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button for non-authenticated users */
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaUser className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Login</span>
              </button>
            )}
            

            
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
