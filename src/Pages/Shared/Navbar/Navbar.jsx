import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard, MdAssignment, MdPeople, MdNotifications, MdSearch, MdAdd, MdAccountCircle, MdSettings, MdLogout } from "react-icons/md";
import { FaTasks, FaUser } from "react-icons/fa";
import { AuthContext } from "../../../provider/AuthProvider";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsProfileOpen(false);
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
              <Link to="/projects" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <FaTasks className="w-4 h-4" />
                Projects
              </Link>
              <Link to="/tasks" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <MdAssignment className="w-4 h-4" />
                Tasks
              </Link>
              <Link to="/team" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                <MdPeople className="w-4 h-4" />
                Team
              </Link>
             
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4 flex-shrink-0">

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
            

            {/* Create Task Button */}
            <Link
              to="/create-task"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MdAdd className="w-4 h-4" />
              <span>Create</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
