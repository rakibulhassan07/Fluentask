import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import useAxiosPublic from '../../Hook/useAxiosPublic';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
    MdAdd,
    MdViewModule,
    MdViewList,
    MdEdit,
    MdDelete,
    MdPerson,
    MdCalendarToday,
    MdClose,
    MdAssignment,
    MdVisibility,
    MdAccessTime,
    MdGroup,
    MdTrendingUp,
    MdCheckCircle
} from 'react-icons/md';

const Tasks = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    
    const [tasks, setTasks] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban');
    const [selectedProject, setSelectedProject] = useState(null);
    console.log(users)
    
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    
    
    const [quickTasks, setQuickTasks] = useState({
        'To Do': '',
        'In Progress': '',
        'In Review': '',
        'Done': ''
    });
    
   
    const [draggedTask, setDraggedTask] = useState(null);

   
    const columns = [
        { id: 'To Do', title: 'To Do', color: 'bg-gray-100' },
        { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
        { id: 'In Review', title: 'In Review', color: 'bg-yellow-100' },
        { id: 'Done', title: 'Done', color: 'bg-green-100' }
    ];

    // Load data on component mount
    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, []);
    
    // Load teams after users are loaded
    useEffect(() => {
        if (users.length > 0) {
            fetchTeams();
        }
    }, [users, user]);

    // Check if current user is a team leader
    const isTeamLeader = () => {
        if (!user || teams.length === 0) return false;
        // Check multiple possible user identification methods
        const userIdentifiers = [
            user.uid,
            user.email,
            user._id,
            user.displayName,
            user.name
        ].filter(Boolean);
        
        return teams.some(team => 
            userIdentifiers.some(identifier => 
                team.leader === identifier || 
                team.leaderId === identifier
            )
        );
    };

    const fetchTeams = async () => {
        try {
            const response = await axiosPublic.get('/teams');
            const teamsData = response.data;
            setTeams(teamsData);
            
            // Extract projects where current user is leader or member
            if (user && teamsData.length > 0 && users.length > 0) {
                const currentUserEmail = user.email;
                const userProjects = [];
                
                teamsData.forEach(team => {
                    // Find current user in users array
                    const currentUser = users.find(u => u.email === currentUserEmail);
                    if (!currentUser) return;
                    
                    // Check if user is team leader
                    const isLeader = team.leader === currentUser._id;
                    // Check if user is team member
                    const isMember = team.members && team.members.includes(currentUser._id);
                    
                    if ((isLeader || isMember) && team.project && team.project.trim()) {
                        // Check if project already exists in userProjects
                        const existingProject = userProjects.find(p => p.name === team.project);
                        if (!existingProject) {
                            userProjects.push({
                                name: team.project,
                                teamName: team.name,
                                teamId: team._id,
                                role: isLeader ? 'Leader' : 'Member',
                                teams: [team]
                            });
                        } else {
                            // Add team to existing project
                            existingProject.teams.push(team);
                            if (isLeader && existingProject.role === 'Member') {
                                // Update role to Leader if user is leader in any team for this project
                                existingProject.role = 'Leader';
                            }
                        }
                    }
                });
                
                setProjects(userProjects);
                
                // Auto-select first project if none selected
                if (userProjects.length > 0 && !selectedProject) {
                    setSelectedProject(userProjects[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            toast.error('Failed to fetch teams');
        }
    };

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

    const fetchTasks = async () => {
        try {
            const response = await axiosPublic.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        }
    };

    // Helper functions
    const getUserById = (userId) => {
        return users.find(user => user._id === userId);
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    const getPriorityColor = (priority) => {
        const colors = {
            Low: 'bg-green-100 text-green-800',
            Medium: 'bg-yellow-100 text-yellow-800',
            High: 'bg-orange-100 text-orange-800',
            Critical: 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getTagColor = (index) => {
        const colors = [
            'bg-purple-100 text-purple-800',
            'bg-pink-100 text-pink-800',
            'bg-indigo-100 text-indigo-800',
            'bg-cyan-100 text-cyan-800'
        ];
        return colors[index % colors.length];
    };

    // Format creation time for display
    const formatCreationTime = (createdAt) => {
        if (!createdAt) return '';
        const created = new Date(createdAt);
        
        // Format as: "Sep 19, 2025 at 2:30 PM"
        const dateOptions = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        const timeOptions = { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true
        };
        
        const dateStr = created.toLocaleDateString('en-US', dateOptions);
        const timeStr = created.toLocaleTimeString('en-US', timeOptions);
        
        return `${dateStr} at ${timeStr}`;
    };

    // Format creation time for task cards (shorter format)
    const formatCreationTimeShort = (createdAt) => {
        if (!createdAt) return '';
        const created = new Date(createdAt);
        const now = new Date();
        const isToday = created.toDateString() === now.toDateString();
        
        if (isToday) {
            // Show time if created today: "2:30 PM"
            return created.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true
            });
        } else {
            // Show date if not today: "Sep 19"
            return created.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
            });
        }
    };

    // Get team members from selected project's teams
    const getUserTeamMembers = () => {
        if (!user || teams.length === 0 || users.length === 0 || !selectedProject) return [];
        
        const currentUser = users.find(u => u.email === user.email);
        if (!currentUser) return [];
        
        const teamMemberIds = new Set();
        
        // Get teams for the selected project
        const projectTeams = selectedProject.teams || [];
        
        projectTeams.forEach(team => {
            // Check if current user is leader or member of this team
            const isLeader = team.leader === currentUser._id;
            const isMember = team.members && team.members.includes(currentUser._id);
            
            if (isLeader || isMember) {
                // Add all team members to the set
                if (team.members) {
                    team.members.forEach(memberId => teamMemberIds.add(memberId));
                }
                // Add team leader too
                if (team.leader) {
                    teamMemberIds.add(team.leader);
                }
            }
        });
        
        // Convert member IDs to user objects
        return Array.from(teamMemberIds)
            .map(memberId => users.find(user => user._id === memberId))
            .filter(Boolean);
    };

    // Filter tasks by selected project
    const filteredTasks = tasks.filter(task => {
        if (!selectedProject) return false;
        
        // For tasks created with project field (new tasks)
        if (task.project) {
            return task.project === selectedProject.name;
        }
        
        // For legacy tasks without project field - don't show them 
        // to avoid confusion between projects until they're migrated
        return false;
    });

    // Get tasks for specific column
    const getColumnTasks = (status) => {
        return filteredTasks.filter(task => task.status === status);
    };

    // Calculate team contribution statistics
    const getTeamContribution = () => {
        const teamMembers = getUserTeamMembers();
        const contributions = [];
        
        // Calculate total team tasks first
        const totalTeamTasks = filteredTasks.length;

        teamMembers.forEach(member => {
            const memberName = member.name || member.email;
            const memberTasks = filteredTasks.filter(task => task.assignedTo === memberName);
            
            const totalTasks = memberTasks.length;
            const completedTasks = memberTasks.filter(task => task.status === 'Done').length;
            const inProgressTasks = memberTasks.filter(task => task.status === 'In Progress').length;
            const inReviewTasks = memberTasks.filter(task => task.status === 'In Review').length;
            const todoTasks = memberTasks.filter(task => task.status === 'To Do').length;
            
            // Individual completion rate for this member
            const individualCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // Contribution to total team workload (percentage of total team tasks)
            const teamContributionPercentage = totalTeamTasks > 0 ? Math.round((totalTasks / totalTeamTasks) * 100) : 0;
            
            contributions.push({
                name: memberName,
                photoURL: member.photoURL || member.image || member.profilePicture || member.avatar || member.photo,
                totalTasks,
                completedTasks,
                inProgressTasks,
                inReviewTasks,
                todoTasks,
                individualCompletionRate,
                teamContributionPercentage,
                isCurrentUser: member.email === user?.email
            });
        });

        // Sort by team contribution percentage (highest first)
        return contributions.sort((a, b) => b.teamContributionPercentage - a.teamContributionPercentage);
    };

    // Memoize team contribution to avoid recalculation
    const teamContribution = getTeamContribution();

    // Delete task
    const handleDelete = async (taskId) => {
        const result = await Swal.fire({
            title: 'Delete Task?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(`/tasks/${taskId}`);
                fetchTasks(); // Refresh tasks list
                toast.success('Task deleted successfully!');
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task');
            }
        }
    };

    // Quick task creation
    const handleQuickTaskCreate = async (status) => {
        const taskTitle = quickTasks[status].trim();
        if (!taskTitle || !selectedProject) {
            if (!selectedProject) {
                toast.error('Please select a project first');
            }
            return;
        }

        // Get current user for assignedTo (assign to self by default)
        const currentUser = users.find(u => u.email === user?.email);
        const assignedTo = currentUser ? (currentUser.name || currentUser.email) : (user?.name || user?.email);

        const newTask = {
            title: taskTitle,
            description: '', // Empty description for quick tasks
            priority: 'Medium',
            status: status,
            assignedTo: assignedTo,
            project: selectedProject.name, // Add project field
            projectId: selectedProject.teams[0]?._id, // Add project/team reference
            dueDate: null,
            estimatedHours: null,
            tags: [],
            createdBy: user?.name || user?.email || user?.displayName,
            createdAt: new Date().toISOString()
        };

        try {
            await axiosPublic.post('/tasks', newTask);
            
            // Clear the input
            setQuickTasks(prev => ({
                ...prev,
                [status]: ''
            }));
            
            // Refresh tasks list
            fetchTasks();
            toast.success('Task created successfully!');
        } catch (error) {
            console.error('Error creating quick task:', error);
            toast.error('Failed to create task');
        }
    };

    const handleQuickTaskKeyPress = (e, status) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleQuickTaskCreate(status);
        }
    };

    // Drag and drop functions
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== newStatus) {
            try {
                // Update task status in backend
                await axiosPublic.put(`/tasks/${draggedTask._id}`, {
                    ...draggedTask,
                    status: newStatus
                });
                
                // Update local state
                setTasks(tasks.map(task =>
                    task._id === draggedTask._id
                        ? { ...task, status: newStatus }
                        : task
                ));
                toast.success(`Task moved to ${newStatus}`);
            } catch (error) {
                console.error('Error updating task status:', error);
                toast.error('Failed to update task status');
            }
        }
        setDraggedTask(null);
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
                            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
                        </div>
                    </div>

                    {/* Project Selector */}
                    {projects.length > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MdAssignment className="w-5 h-5 text-purple-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Select Project</h2>
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {projects.length} projects
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {projects.map((project, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => setSelectedProject(project)}
                                        className={`cursor-pointer border rounded-lg p-3 transition-all ${
                                            selectedProject?.name === project.name
                                                ? 'border-purple-300 bg-purple-50 shadow-md'
                                                : 'border-gray-200 bg-gray-50 hover:border-purple-200 hover:bg-purple-25'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {project.role} • {project.teams.length} team{project.teams.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="ml-2">
                                                {selectedProject?.name === project.name && (
                                                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Current Project Display */}
                    {selectedProject && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MdAssignment className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Current Project</h2>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 text-sm">{selectedProject.name}</h3>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Role: {selectedProject.role} • Teams: {selectedProject.teams.map(t => t.name).join(', ')}
                                        </p>
                                    </div>
                                    <div className="ml-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            selectedProject.role === 'Leader' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {selectedProject.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects Section */}
                    {projects.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MdAssignment className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {projects.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {projects.map((project, index) => (
                                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
                                                <p className="text-xs text-gray-600 mt-1">Team: {project.teamName}</p>
                                            </div>
                                            <div className="ml-2">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    project.role === 'Leader' 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {project.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Team Contribution Section */}
                    {selectedProject && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MdGroup className="w-5 h-5 text-green-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Team Contribution - {selectedProject.name}
                                    </h2>
                                    <MdTrendingUp className="w-4 h-4 text-green-600" />
                                </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-bold text-lg text-gray-900">
                                        {teamContribution.length}
                                    </div>
                                    <div className="text-xs text-gray-600">Team Members</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg text-blue-600">
                                        {filteredTasks.length}
                                    </div>
                                    <div className="text-xs text-gray-600">Total Tasks</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg text-green-600">
                                        {Math.round(teamContribution.reduce((sum, member) => sum + member.individualCompletionRate, 0) / Math.max(teamContribution.length, 1))}%
                                    </div>
                                    <div className="text-xs text-gray-600">Avg Completion</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamContribution.map((member, index) => (
                                <div key={index} className={`border rounded-lg p-4 ${
                                    member.isCurrentUser 
                                        ? 'border-blue-200 bg-blue-50' 
                                        : 'border-gray-200 bg-gray-50'
                                }`}>
                                    {/* Member Info */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                           
                                                <img
                                                    src={member.photoURL}
                                                    alt={member.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                           
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 text-sm">
                                                {member.name}
                                                {member.isCurrentUser && (
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                                                )}
                                            </h3>
                                            <p className="text-xs text-gray-600">{member.totalTasks} tasks assigned</p>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bars */}
                                    <div className="space-y-3 mb-3">
                                        {/* Team Contribution */}
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-blue-700">Team Workload</span>
                                                <span className="text-xs font-bold text-blue-900">{member.teamContributionPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full bg-blue-500 transition-all"
                                                    style={{ width: `${member.teamContributionPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        {/* Individual Completion */}
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-gray-700">Task Completion</span>
                                                <span className="text-xs font-bold text-gray-900">{member.individualCompletionRate}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${
                                                        member.individualCompletionRate >= 80 
                                                            ? 'bg-green-500' 
                                                            : member.individualCompletionRate >= 60 
                                                            ? 'bg-yellow-500' 
                                                            : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${member.individualCompletionRate}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Task Stats */}
                                    <div className="grid grid-cols-4 gap-1 text-xs">
                                        <div className="text-center p-2 bg-white rounded border">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <MdCheckCircle className="w-3 h-3 text-green-600" />
                                                <span className="font-bold text-green-600">{member.completedTasks}</span>
                                            </div>
                                            <span className="text-gray-600">Done</span>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded border">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span className="font-bold text-blue-600">{member.inProgressTasks}</span>
                                            </div>
                                            <span className="text-gray-600">Progress</span>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded border">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <span className="font-bold text-yellow-600">{member.inReviewTasks}</span>
                                            </div>
                                            <span className="text-gray-600">Review</span>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded border">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                                <span className="font-bold text-gray-600">{member.todoTasks}</span>
                                            </div>
                                            <span className="text-gray-600">To Do</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}

                    {/* Controls Bar */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-end">
                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('kanban')}
                                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                                        viewMode === 'kanban' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <MdViewModule className="w-4 h-4" />
                                    Kanban
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <MdViewList className="w-4 h-4" />
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task Views */}
                {selectedProject ? (
                    viewMode === 'kanban' ? (
                    // Kanban Board
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {columns.map(column => {
                            const columnTasks = getColumnTasks(column.id);
                            return (
                                <div
                                    key={column.id}
                                    className={`${column.color} rounded-lg p-4 min-h-[500px]`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, column.id)}
                                >
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        {column.title} ({columnTasks.length})
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {columnTasks.map(task => (
                                            <div
                                                key={task._id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-all"
                                            >
                                                {/* Task Header */}
                                                <div className="mb-2 flex items-start justify-between">
                                                    <h4 
                                                        className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 flex-1"
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setShowTaskDetails(true);
                                                        }}
                                                    >
                                                        {task.title}
                                                    </h4>
                                                    {/* Delete Button - Show for leaders or task owners */}
                                                    {(isTeamLeader() || task.assignedTo === (user?.name || user?.email)) && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(task._id);
                                                            }}
                                                            className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                                                            title="Delete Task"
                                                        >
                                                            <MdDelete className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {/* Task Description */}
                                                <p className="text-gray-600 text-xs mb-2">{task.description}</p>
                                                
                                                {/* Tags */}
                                                {task.tags && task.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {task.tags.slice(0, 2).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(index)}`}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {task.tags.length > 2 && (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                                +{task.tags.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Progress Bar */}
                                                {task.progress !== undefined && (
                                                    <div className="mb-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-gray-500">Progress</span>
                                                            <span className="text-xs text-gray-500">{task.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                                            <div
                                                                className="h-1 rounded-full bg-blue-500 transition-all"
                                                                style={{ width: `${task.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Task Footer */}
                                                <div className="space-y-1 mt-2">
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <MdPerson className="w-3 h-3" />
                                                            <span>{task.assignedTo}</span>
                                                        </div>
                                                        {task.dueDate && (
                                                            <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                                                                <MdCalendarToday className="w-3 h-3" />
                                                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Creation Time */}
                                                    <div className="flex items-center gap-1 text-xs text-gray-400" title={`Created ${formatCreationTime(task.createdAt)}`}>
                                                        <MdAccessTime className="w-3 h-3" />
                                                        <span>{formatCreationTimeShort(task.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Quick Add Task Input */}
                                        <div className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                            <input
                                                type="text"
                                                placeholder="What needs to be done?"
                                                value={quickTasks[column.id]}
                                                onChange={(e) => setQuickTasks(prev => ({
                                                    ...prev,
                                                    [column.id]: e.target.value
                                                }))}
                                                onKeyPress={(e) => handleQuickTaskKeyPress(e, column.id)}
                                                className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // List View
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Task List</h3>
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <MdAssignment className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating a new task.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredTasks.map(task => (
                                        <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                        <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        <span>{task.assignedTo}</span>
                                                        {task.dueDate && (
                                                            <span className={isOverdue(task.dueDate) ? 'text-red-600' : ''}>
                                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setShowTaskDetails(true);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                                    >
                                                        <MdVisibility className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                                    >
                                                        <MdDelete className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
                ) : (
                    // No Project Selected
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center">
                            <MdAssignment className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No Project Selected</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Please select a project above to view tasks and team contributions.
                            </p>
                        </div>
                    </div>
                )}

                {/* Simple Task Details Modal */}
                {showTaskDetails && selectedTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                                        {selectedTask.priority}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowTaskDetails(false);
                                        setSelectedTask(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <MdClose className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Description */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-600">{selectedTask.description}</p>
                                    </div>
                                    
                                    {/* Task Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Assigned to</h4>
                                            <p className="text-gray-600">{selectedTask.assignedTo}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Status</h4>
                                            <p className="text-gray-600">{selectedTask.status}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Priority</h4>
                                            <p className="text-gray-600">{selectedTask.priority}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Due Date</h4>
                                            <p className={`${isOverdue(selectedTask.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
                                                {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Not set'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Created</h4>
                                            <p className="text-gray-600">
                                                {selectedTask.createdAt ? formatCreationTime(selectedTask.createdAt) : 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">Created By</h4>
                                            <p className="text-gray-600">{selectedTask.createdBy || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Tags */}
                                    {selectedTask.tags && selectedTask.tags.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTask.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(index)}`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => {
                                                setShowTaskDetails(false);
                                                handleDelete(selectedTask._id);
                                            }}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-2"
                                        >
                                            <MdDelete className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;