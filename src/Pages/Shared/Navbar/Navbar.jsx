import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdDashboard, MdAssignment, MdPeople, MdNotifications, MdSearch, MdAdd, MdAccountCircle, MdSettings, MdLogout, MdCheck, MdClose, MdChat } from "react-icons/md";
import { FaTasks, FaUser } from "react-icons/fa";
import { AuthContext } from "../../../provider/AuthProvider";
import useAxiosPublic from "../../../Hook/useAxiosPublic";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current path matches navigation link
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

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

  // Fetch invitations and notifications when user is logged in
  useEffect(() => {
    if (user?.email) {
      fetchInvitations();
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (user?.email && users.length > 0) {
      fetchNotifications();
    }
  }, [user, users]);

  const fetchUsers = async () => {
    try {
      const response = await axiosPublic.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await axiosPublic.get(`/invitations/user/${user?.email}`);
      setInvitations(response.data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const currentUser = users.find(u => u.email === user?.email);
      if (currentUser?._id) {
        const response = await axiosPublic.get(`/notifications/user/${currentUser._id}`);
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await axiosPublic.put(`/invitations/${invitationId}/accept`);
      fetchInvitations(); // Refresh invitations
      fetchNotifications(); // Refresh notifications
      // You might want to show a success message here
    } catch (error) {
      console.error('Error accepting invitation:', error);
      // You might want to show an error message here
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      await axiosPublic.put(`/invitations/${invitationId}/decline`);
      fetchInvitations(); // Refresh invitations
      fetchNotifications(); // Refresh notifications
      // You might want to show a success message here
    } catch (error) {
      console.error('Error declining invitation:', error);
      // You might want to show an error message here
    }
  };

  const markAllAsRead = async () => {
    try {
      const currentUser = users.find(u => u.email === user?.email);
      if (currentUser?._id) {
        await axiosPublic.put(`/notifications/user/${currentUser._id}/mark-all-read`);
        fetchNotifications(); // Refresh notifications
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark the notification as read
      if (!notification.read) {
        await axiosPublic.put(`/notifications/${notification._id}/mark-read`);
        fetchNotifications(); // Refresh notifications
      }

      // Navigate based on notification type
      if (notification.type === 'invitation_accepted' || notification.type === 'invitation_declined') {
        navigate('/team');
      }
      
      // Close the notification dropdown
      setIsNotificationOpen(false);
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load:', user?.photoURL);
    setImageError(true);
  };

  const getTotalNotificationCount = () => {
    const unreadNotifications = notifications.filter(n => !n.read).length;
    const pendingInvitations = invitations.length;
    return unreadNotifications + pendingInvitations;
  };



  


  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-white/95 border-b border-gray-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 transition-all duration-200 hover:scale-105">
              <div className={`w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isScrolled ? 'shadow-lg' : 'shadow-md'
              }`}>
                <FaTasks className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-gray-900'
              }`}>Fluentask</span>
            </Link>
          </div>

          {/* Center: Navigation - Equal spacing */}
          <nav className="flex flex-1 justify-center">
            <div className="flex space-x-2">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveLink('/') 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <MdDashboard className="w-4 h-4" />
                Home
                {isActiveLink('/') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
              </Link>
              
              <Link 
                to="/team" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                  isActiveLink('/team') 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <MdPeople className="w-4 h-4" />
                Team
                {isActiveLink('/team') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
              </Link>
              
              <Link 
                to="/projects" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                  isActiveLink('/projects') 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <FaTasks className="w-4 h-4" />
                Projects
                {isActiveLink('/projects') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
              </Link>
              
              <Link 
                to="/tasks" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                  isActiveLink('/tasks') 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <MdAssignment className="w-4 h-4" />
                Tasks
                {isActiveLink('/tasks') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>}
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
                  className={`p-2 rounded-lg transition-all duration-200 relative ${
                    isScrolled 
                      ? 'hover:bg-white/50 backdrop-blur-sm' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <MdNotifications className={`w-5 h-5 transition-colors ${
                    isScrolled ? 'text-gray-700' : 'text-gray-600'
                  }`} />
                  {/* Notification badge */}
                  {getTotalNotificationCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg">
                      {getTotalNotificationCount() > 99 ? '99+' : getTotalNotificationCount()}
                    </span>
                  )}
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
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {/* Team Invitations */}
                      {invitations.map((invitation) => (
                        <div key={invitation._id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors bg-yellow-50 border-l-4 border-l-yellow-400">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm text-gray-900 font-medium">Team Invitation</p>
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                                  Pending
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {invitation.inviterName} invited you to join "{invitation.teamName}"
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(invitation.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcceptInvitation(invitation._id);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors"
                                >
                                  <MdCheck className="w-3 h-3" />
                                  Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeclineInvitation(invitation._id);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                                >
                                  <MdClose className="w-3 h-3" />
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Regular Notifications */}
                      {notifications.map((notification) => (
                        <div 
                          key={notification._id} 
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === 'invitation_accepted' ? 'bg-green-500' :
                              notification.type === 'invitation_declined' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">
                                {notification.type === 'invitation_accepted' ? 'Invitation Accepted' :
                                 notification.type === 'invitation_declined' ? 'Invitation Declined' :
                                 'Notification'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                              {notification.teamName && (
                                <p className="text-xs text-gray-400 mt-1">Team: {notification.teamName}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                              {!notification.read && (
                                <div className="flex items-center mt-1">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                                  <span className="text-xs text-blue-600 font-medium">New</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* No notifications message */}
                      {invitations.length === 0 && notifications.length === 0 && (
                        <div className="p-8 text-center">
                          <MdNotifications className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                      <button 
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => {
                          setIsNotificationOpen(false);
                          // You can navigate to a dedicated notifications page here if you have one
                          // navigate('/notifications');
                        }}
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
                  className={`flex items-center space-x-2 p-1 rounded-lg transition-all duration-200 ${
                    isScrolled 
                      ? 'hover:bg-white/50 backdrop-blur-sm' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {user.photoURL && !imageError ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {getInitials(user.displayName || user.email)}
                      </span>
                    </div>
                  )}
                  <span className={`text-sm font-medium transition-colors ${
                    isScrolled ? 'text-gray-800' : 'text-gray-700'
                  }`}>
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isScrolled 
                    ? 'bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-800' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <FaUser className="w-4 h-4" />
                <span className="text-sm">Login</span>
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