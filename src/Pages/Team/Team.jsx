import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import useAxiosPublic from '../../Hook/useAxiosPublic';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
    MdAdd,
    MdPerson,
    MdGroup,
    MdDelete,
    MdClose,
    MdAdminPanelSettings,
    MdWork
} from 'react-icons/md';

const Team = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    // State management
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    
    // Team form
    const [teamForm, setTeamForm] = useState({
        name: '',
        description: '',
        members: [],
        project: '',
        createdAt: new Date().toISOString()
    });

    // Fetch data on component mount
    useEffect(() => {
        fetchUsers();
        fetchTeams();
    }, []);

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

    // Filter teams created by current user (using leader field since creator is removed)
    const myTeams = teams.filter(team => {
        const currentUser = users.find(u => u.email === user?.email);
        return team.leader === currentUser?._id;
    });

    // Handle team creation
    const handleCreateTeam = async (e) => {
        e.preventDefault();
        
        if (!teamForm.name.trim() || teamForm.members.length === 0) {
            toast.error('Please provide team name and at least one member');
            return;
        }

        try {
            // Find current user in users array to get their _id
            const currentUser = users.find(u => u.email === user?.email);
            
            // Add current user as team creator and leader
            const teamData = {
                ...teamForm,
                createdBy: user?.name || user?.email, // Add creator name
                leader: currentUser?._id // Set current user as leader
            };

            const response = await axiosPublic.post('/teams', teamData);
            if (response.data.insertedId) {
                // Update current user's role to "leader" in the database
                try {
                    await axiosPublic.put(`/users/email/${user?.email}/role`, { role: 'leader' });
                    toast.success('Team created successfully! You are now the team leader.');
                } catch (roleError) {
                    console.error('Error updating leader role:', roleError);
                    toast.success('Team created successfully! (Note: Leader role update failed)');
                }
                
                setShowCreateTeamModal(false);
                setTeamForm({
                    name: '',
                    description: '',
                    members: [],
                    project: '',
                    createdAt: new Date().toISOString()
                });
                fetchTeams();
                fetchUsers(); // Refresh users to show updated roles
            }
        } catch (error) {
            console.error('Error creating team:', error);
            toast.error('Failed to create team');
        }
    };

    // Handle team deletion
    const handleDeleteTeam = async (teamId) => {
        const result = await Swal.fire({
            title: 'Delete Team?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(`/teams/${teamId}`);
                toast.success('Team deleted successfully!');
                fetchTeams();
            } catch (error) {
                console.error('Error deleting team:', error);
                toast.error('Failed to delete team');
            }
        }
    };

    // Toggle member selection for team
    const toggleMemberSelection = (userId) => {
        setTeamForm(prev => ({
            ...prev,
            members: prev.members.includes(userId)
                ? prev.members.filter(id => id !== userId)
                : [...prev.members, userId]
        }));
    };

    const getUserById = (userId) => {
        return users.find(user => user._id === userId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                            <p className="text-gray-600">Manage your team members and create teams for projects</p>
                        </div>
                        <button
                            onClick={() => setShowCreateTeamModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg"
                        >
                            <MdAdd className="w-5 h-5" />
                            Create Team
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Teams Section */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <MdGroup className="w-6 h-6" />
                                    My Teams ({myTeams.length})
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Teams created by you</p>
                            </div>
                            <div className="p-6">
                                {myTeams.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MdGroup className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No teams created yet</h3>
                                        <p className="mt-1 text-sm text-gray-500">Create your first team to get started.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myTeams.map(team => {
                                            const teamLeader = team.leader ? getUserById(team.leader) : null;
                                            const teamMembersList = team.members.map(memberId => getUserById(memberId)).filter(Boolean);

                                            return (
                                                <div key={team._id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900 mb-1">{team.name}</h3>
                                                            {team.description && (
                                                                <p className="text-sm text-gray-600 mb-2">{team.description}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteTeam(team._id)}
                                                            className="text-red-600 hover:text-red-800 ml-2"
                                                        >
                                                            <MdDelete className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Team Leader */}
                                                    {teamLeader && (
                                                        <div className="mb-3">
                                                            <h4 className="text-xs font-medium text-gray-700 mb-1">Team Leader:</h4>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                                                    {teamLeader.photoURL ? (
                                                                        <img
                                                                            src={teamLeader.photoURL}
                                                                            alt={teamLeader.name}
                                                                            className="w-6 h-6 rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <MdAdminPanelSettings className="w-3 h-3 text-yellow-600" />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {teamLeader.name || teamLeader.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Team Members */}
                                                    {teamMembersList.length > 0 && (
                                                        <div className="mb-3">
                                                            <h4 className="text-xs font-medium text-gray-700 mb-2">Members ({teamMembersList.length}):</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {teamMembersList.map(member => (
                                                                    <div key={member._id} className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
                                                                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                                                            {member.photoURL ? (
                                                                                <img
                                                                                    src={member.photoURL}
                                                                                    alt={member.name}
                                                                                    className="w-5 h-5 rounded-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <MdPerson className="w-3 h-3 text-blue-600" />
                                                                            )}
                                                                        </div>
                                                                        <span className="text-xs text-gray-700">
                                                                            {member.name || member.email.split('@')[0]}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                                                        {team.project && <p>Project: {team.project}</p>}
                                                        <p>Created: {new Date(team.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Team Modal */}
                {showCreateTeamModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Create New Team</h2>
                                <button
                                    onClick={() => setShowCreateTeamModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <MdClose className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreateTeam} className="p-6 space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> You ({user?.name || user?.email}) will be the team creator and team leader automatically. 
                                        Select other registered users as team members.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
                                    <input
                                        type="text"
                                        value={teamForm.name}
                                        onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter team name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={teamForm.description}
                                        onChange={(e) => setTeamForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Describe the team purpose"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                                    <input
                                        type="text"
                                        value={teamForm.project}
                                        onChange={(e) => setTeamForm(prev => ({ ...prev, project: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Associated project"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team Members * ({teamForm.members.length} selected)
                                    </label>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                        <p className="text-sm text-blue-800">
                                            <strong>Team Leader:</strong> You ({user?.name || user?.email}) will be the team leader automatically.
                                        </p>
                                    </div>
                                    <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                                        {users.filter(currentUser => currentUser.email !== user?.email).map(filteredUser => {
                                            const isSelected = teamForm.members.includes(filteredUser._id);
                                            
                                            return (
                                                <div key={filteredUser._id} className="flex items-center gap-2 p-3 border-b border-gray-100 last:border-b-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleMemberSelection(filteredUser._id)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        {filteredUser.photoURL ? (
                                                            <img
                                                                src={filteredUser.photoURL}
                                                                alt={filteredUser.name}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <MdPerson className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{filteredUser.name || 'N/A'}</p>
                                                            <p className="text-xs text-gray-500">{filteredUser.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateTeamModal(false)}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Create Team
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
