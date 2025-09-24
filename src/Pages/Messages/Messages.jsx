import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import useAxiosPublic from '../../Hook/useAxiosPublic';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
    MdChat,
    MdSend,
    MdDelete,
    MdGroup,
    MdPerson,
    MdAdminPanelSettings,
    MdArrowBack,
    MdRefresh
} from 'react-icons/md';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    // State management
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messagePolling, setMessagePolling] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchUsers();
        fetchTeams();
        
        // Refresh teams list every 10 seconds to detect if teams are deleted
        const teamsRefresh = setInterval(() => {
            fetchTeams();
        }, 10000);
        
        return () => {
            clearInterval(teamsRefresh);
        };
    }, []);

    // Cleanup polling on component unmount
    useEffect(() => {
        return () => {
            if (messagePolling) {
                clearInterval(messagePolling);
            }
        };
    }, [messagePolling]);

    // Check if selected team still exists
    useEffect(() => {
        if (selectedTeam && teams.length > 0) {
            const teamStillExists = teams.find(team => team._id === selectedTeam._id);
            if (!teamStillExists) {
                toast.error('The selected team has been deleted.');
                closeTeamChat();
            }
        }
    }, [teams, selectedTeam]);

    const fetchUsers = async () => {
        try {
            const response = await axiosPublic.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axiosPublic.get('/teams');
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching teams:', error);
            toast.error('Failed to fetch teams');
        }
    };

    // Filter teams where current user is leader or member
    const userTeams = teams.filter(team => {
        const currentUser = users.find(u => u.email === user?.email);
        return team.leader === currentUser?._id || team.members.includes(currentUser?._id);
    });

    // Chat functions
    const openTeamChat = async (team) => {
        setSelectedTeam(team);
        await fetchTeamMessages(team._id);
        
        // Start polling for new messages every 3 seconds
        const polling = setInterval(() => {
            fetchTeamMessages(team._id, false); // Silent fetch without loading indicator
        }, 3000);
        setMessagePolling(polling);
    };

    const closeTeamChat = () => {
        setSelectedTeam(null);
        setMessages([]);
        
        // Clear polling interval
        if (messagePolling) {
            clearInterval(messagePolling);
            setMessagePolling(null);
        }
    };

    const fetchTeamMessages = async (teamId, showLoading = true) => {
        if (showLoading) setLoadingMessages(true);
        try {
            const currentUser = users.find(u => u.email === user?.email);
            const response = await axiosPublic.get(`/teams/${teamId}/messages?userId=${currentUser?._id}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            if (error.response?.status === 404) {
                // Team was deleted, close the chat and refresh teams
                toast.error('Team no longer exists. It may have been deleted.');
                closeTeamChat();
                fetchTeams();
            } else if (showLoading) {
                toast.error('Failed to load messages');
            }
        } finally {
            if (showLoading) setLoadingMessages(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTeam) return;

        try {
            const currentUser = users.find(u => u.email === user?.email);
            const messageData = {
                message: newMessage.trim(),
                senderId: currentUser?._id,
                senderName: currentUser?.name || user?.name,
                senderEmail: user?.email
            };

            await axiosPublic.post(`/teams/${selectedTeam._id}/messages`, messageData);
            setNewMessage('');
            await fetchTeamMessages(selectedTeam._id);
            toast.success('Message sent!');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const deleteMessage = async (messageId) => {
        const result = await Swal.fire({
            title: 'Delete Message?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
      
        if (result.isConfirmed) {
            try {
                const currentUser = users.find(u => u.email === user?.email);
                await axiosPublic.delete(`/messages/${messageId}`, {
                    data: { userId: currentUser?._id }
                });
                
                toast.success('Message deleted!');
            } catch (error) {
                console.error('Error deleting message:', error);
                toast.error('Failed to delete message');
            }
           
        }
        
    };
   

    const getUserById = (userId) => {
        return users.find(user => user._id === userId);
    };

    const refreshMessages = () => {
        if (selectedTeam) {
            fetchTeamMessages(selectedTeam._id);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <MdChat className="w-8 h-8 text-blue-600" />
                        Team Messages
                    </h1>
                    <p className="text-gray-600 mt-2">Chat with your team members in real-time</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Teams List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <MdGroup className="w-5 h-5" />
                                    Your Teams ({userTeams.length})
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {userTeams.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MdGroup className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Join or create a team to start chatting.</p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        {userTeams.map(team => {
                                            const teamLeader = team.leader ? getUserById(team.leader) : null;
                                            const currentUser = users.find(u => u.email === user?.email);
                                            const isLeader = team.leader === currentUser?._id;

                                            return (
                                                <div
                                                    key={team._id}
                                                    onClick={() => openTeamChat(team)}
                                                    className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                                                        selectedTeam?._id === team._id
                                                            ? 'bg-blue-100 border border-blue-300'
                                                            : 'hover:bg-gray-50 border border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            isLeader ? 'bg-yellow-100' : 'bg-blue-100'
                                                        }`}>
                                                            {isLeader ? (
                                                                <MdAdminPanelSettings className="w-5 h-5 text-yellow-600" />
                                                            ) : (
                                                                <MdPerson className="w-5 h-5 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {team.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {isLeader ? 'Team Leader' : 'Member'} • {team.members.length + 1} members
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
                            {selectedTeam ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={closeTeamChat}
                                                className="lg:hidden text-gray-400 hover:text-gray-600"
                                            >
                                                <MdArrowBack className="w-5 h-5" />
                                            </button>
                                            <MdChat className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">{selectedTeam.name}</h2>
                                                <p className="text-sm text-gray-500">Team Chat</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={refreshMessages}
                                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                            title="Refresh Messages"
                                        >
                                            <MdRefresh className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {loadingMessages ? (
                                            <div className="flex items-center justify-center h-32">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="text-center py-8">
                                                <MdChat className="mx-auto h-12 w-12 text-gray-400" />
                                                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                                                <p className="mt-1 text-sm text-gray-500">Start a conversation with your team.</p>
                                            </div>
                                        ) : (
                                            messages.map(message => {
                                                const currentUser = users.find(u => u.email === user?.email);
                                                const isOwnMessage = message.senderId === currentUser?._id;
                                                const isDeleted = message.deleted;
                                                
                                                return (
                                                    <div key={message._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[70%] rounded-lg p-3 ${
                                                            isDeleted
                                                                ? 'bg-gray-50 text-gray-500 border border-gray-200'
                                                                : isOwnMessage 
                                                                    ? 'bg-blue-600 text-white' 
                                                                    : 'bg-gray-100 text-gray-900'
                                                        }`}>
                                                            {!isOwnMessage && !isDeleted && (
                                                                <div className="text-xs font-medium mb-1 opacity-70">
                                                                    {message.senderName || message.senderEmail}
                                                                </div>
                                                            )}
                                                            <div className={`text-sm ${isDeleted ? 'italic' : ''}`}>
                                                                {message.message}
                                                            </div>
                                                            {message.edited && !isDeleted && (
                                                                <div className="text-xs opacity-60 mt-1">(edited)</div>
                                                            )}
                                                            <div className="flex items-center justify-between mt-2">
                                                                <div className="text-xs opacity-60">
                                                                    {new Date(message.createdAt).toLocaleTimeString()}
                                                                </div>
                                                                {isOwnMessage && !isDeleted && (
                                                                    <button

                                                                        onClick={() => deleteMessage(message._id)}
                                                                        className="text-xs opacity-60 hover:opacity-100 ml-2 hover:text-red-400 transition-colors"
                                                                        title="Delete message"
                                                                        
                                                                    >
                                                                        <MdDelete className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                               
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-200">
                                        <form onSubmit={sendMessage} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <MdSend className="w-4 h-4" />
                                                Send
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <MdChat className="mx-auto h-16 w-16 text-gray-400" />
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Select a team to start chatting</h3>
                                        <p className="mt-2 text-sm text-gray-500">Choose a team from the left sidebar to view and send messages.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;