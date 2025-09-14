import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
    MdAdd,
    MdSearch,
    MdFilterList,
    MdViewModule,
    MdViewList,
    MdEdit,
    MdDelete,
    MdPerson,
    MdCalendarToday,
    MdClose,
    MdAssignment,
    MdVisibility,
    MdConstruction
} from 'react-icons/md';

const Tasks = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    // State Management
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    // Timer states
    const [activeTimer, setActiveTimer] = useState(null);
    const [timerStart, setTimerStart] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Form states
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        priority: '',
        status: 'To Do',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0,
        actualHours: 0,
        storyPoints: 0,
        tags: [],
        dependencies: [],
        subtasks: [],
        attachments: [],
        comments: []
    });

    const [newComment, setNewComment] = useState('');
    const [draggedTask, setDraggedTask] = useState(null);

    // Sample data for demonstration
    const sampleTasks = [
        {
            id: '1',
            title: 'Design User Authentication Flow',
            description: 'Create wireframes and mockups for the user authentication system',
            priority: 'High',
            status: 'In Progress',
            assignedTo: 'John Doe',
            dueDate: '2024-01-15',
            estimatedHours: 8,
            actualHours: 4.5,
            storyPoints: 5,
            tags: ['Design', 'Authentication', 'UI/UX'],
            dependencies: [],
            subtasks: [
                { title: 'Research authentication patterns', completed: true },
                { title: 'Create login wireframe', completed: true },
                { title: 'Create signup wireframe', completed: false },
                { title: 'Design forgot password flow', completed: false }
            ],
            attachments: [
                { name: 'Auth Flow Diagram.pdf', type: 'file', url: '#' },
                { name: 'Design System Guide', type: 'link', url: 'https://example.com' }
            ],
            comments: [
                {
                    author: 'Jane Smith',
                    text: 'Great progress on the wireframes! The login flow looks intuitive.',
                    timestamp: new Date().toISOString()
                }
            ],
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Implement Task Management API',
            description: 'Build REST API endpoints for CRUD operations on tasks',
            priority: 'Critical',
            status: 'To Do',
            assignedTo: 'Jane Smith',
            dueDate: '2024-01-20',
            estimatedHours: 12,
            actualHours: 0,
            storyPoints: 8,
            tags: ['Backend', 'API', 'Database'],
            dependencies: ['1'],
            subtasks: [
                { title: 'Set up database schema', completed: false },
                { title: 'Create task model', completed: false },
                { title: 'Implement CRUD endpoints', completed: false },
                { title: 'Add validation and error handling', completed: false }
            ],
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            title: 'Write Documentation',
            description: 'Create comprehensive documentation for the project',
            priority: 'Medium',
            status: 'Done',
            assignedTo: 'Mike Johnson',
            dueDate: '2024-01-10',
            estimatedHours: 6,
            actualHours: 5.5,
            storyPoints: 3,
            tags: ['Documentation', 'Writing'],
            dependencies: [],
            subtasks: [
                { title: 'API documentation', completed: true },
                { title: 'User guide', completed: true },
                { title: 'Installation guide', completed: true }
            ],
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString()
        }
    ];

    // Kanban columns configuration
    const kanbanColumns = [
        { id: 'To Do', title: 'To Do', color: 'bg-gray-100', limit: 5 },
        { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100', limit: 3 },
        { id: 'In Review', title: 'In Review', color: 'bg-yellow-100', limit: 2 },
        { id: 'Done', title: 'Done', color: 'bg-green-100', limit: null }
    ];

    // Initialize tasks
    useEffect(() => {
        setTasks(sampleTasks);
        setLoading(false);
    }, []);

    // Timer effect
    useEffect(() => {
        let interval;
        if (activeTimer && timerStart) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - timerStart);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimer, timerStart]);

    // Utility functions
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isTaskOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    const calculateTaskProgress = (task) => {
        if (!task.subtasks || task.subtasks.length === 0) return 0;
        const completed = task.subtasks.filter(st => st.completed).length;
        return Math.round((completed / task.subtasks.length) * 100);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            Low: 'bg-green-100 text-green-800 border-green-300',
            Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            High: 'bg-orange-100 text-orange-800 border-orange-300',
            Critical: 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusColor = (status) => {
        const colors = {
            'To Do': 'bg-gray-100 text-gray-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'In Review': 'bg-yellow-100 text-yellow-800',
            'Done': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getProgressColor = (progress) => {
        if (progress === 100) return 'bg-green-500';
        if (progress >= 75) return 'bg-blue-500';
        if (progress >= 50) return 'bg-yellow-500';
        if (progress >= 25) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getTagColor = (tag) => {
        const colors = [
            'bg-purple-100 text-purple-800',
            'bg-pink-100 text-pink-800',
            'bg-indigo-100 text-indigo-800',
            'bg-cyan-100 text-cyan-800',
            'bg-teal-100 text-teal-800',
            'bg-lime-100 text-lime-800'
        ];
        const hash = tag.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = !selectedPriority || task.priority === selectedPriority;
        const matchesStatus = !selectedStatus || task.status === selectedStatus;
        const matchesAssignee = !selectedAssignee || task.assignedTo === selectedAssignee;
        
        return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
    });

    const getTasksByStatus = (status) => {
        return filteredTasks.filter(task => task.status === status);
    };

    const uniqueAssignees = [...new Set(tasks.map(task => task.assignedTo).filter(Boolean))];

    // Event handlers
    const handleCreateTask = (e) => {
        e.preventDefault();
        const newTask = {
            ...taskForm,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            actualHours: 0,
            comments: []
        };
        
        setTasks(prev => [...prev, newTask]);
        setShowCreateModal(false);
        resetTaskForm();
        toast.success('Task created successfully!');
    };

    const resetTaskForm = () => {
        setTaskForm({
            title: '',
            description: '',
            priority: '',
            status: 'To Do',
            assignedTo: '',
            dueDate: '',
            estimatedHours: 0,
            actualHours: 0,
            storyPoints: 0,
            tags: [],
            dependencies: [],
            subtasks: [],
            attachments: [],
            comments: []
        });
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setTaskForm(task);
        setShowCreateModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setTasks(prev => prev.filter(task => task.id !== taskId));
            toast.success('Task deleted successfully!');
        }
    };

    // Timer functions
    const startTimer = (taskId) => {
        setActiveTimer(taskId);
        setTimerStart(Date.now());
        setElapsedTime(0);
    };

    const pauseTimer = () => {
        if (activeTimer && timerStart) {
            const currentTask = tasks.find(t => t.id === activeTimer);
            if (currentTask) {
                const additionalHours = elapsedTime / (1000 * 60 * 60);
                setTasks(prev => prev.map(task =>
                    task.id === activeTimer
                        ? { ...task, actualHours: task.actualHours + additionalHours }
                        : task
                ));
            }
        }
        setActiveTimer(null);
        setTimerStart(null);
        setElapsedTime(0);
    };

    const stopTimer = () => pauseTimer();

    // Drag and drop handlers
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== newStatus) {
            setTasks(prev => prev.map(task =>
                task.id === draggedTask.id
                    ? { ...task, status: newStatus }
                    : task
            ));
            toast.success(`Task moved to ${newStatus}`);
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
                            <p className="mt-1 text-gray-600">
                                Organize and track your team's work with a Jira-like experience
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg"
                        >
                            <MdAdd className="w-5 h-5" />
                            Create Task
                        </button>
                    </div>

                    {/* Controls Bar */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <MdFilterList className="text-gray-500 w-5 h-5" />
                                
                                <select
                                    value={selectedPriority}
                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Priorities</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Done">Done</option>
                                </select>

                                <select
                                    value={selectedAssignee}
                                    onChange={(e) => setSelectedAssignee(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Assignees</option>
                                    {uniqueAssignees.map(assignee => (
                                        <option key={assignee} value={assignee}>{assignee}</option>
                                    ))}
                                </select>

                                {/* Clear Filters */}
                                {(searchTerm || selectedPriority || selectedStatus || selectedAssignee) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedPriority('');
                                            setSelectedStatus('');
                                            setSelectedAssignee('');
                                        }}
                                        className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

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
                {viewMode === 'kanban' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kanbanColumns.map(column => {
                            const columnTasks = getTasksByStatus(column.id);
                            return (
                                <div
                                    key={column.id}
                                    className={`${column.color} rounded-lg p-4 min-h-[500px]`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, column.id)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {column.title} ({columnTasks.length})
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {columnTasks.map(task => (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 
                                                        className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
                                                        onClick={() => {
                                                            setSelectedTask(task);
                                                            setShowTaskDetails(true);
                                                        }}
                                                    >
                                                        {task.title}
                                                    </h4>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </div>
                                                </div>
                                                
                                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{task.description}</p>
                                                
                                                {task.tags && task.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {task.tags.slice(0, 2).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
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
                                                
                                                {task.subtasks && task.subtasks.length > 0 && (
                                                    <div className="mb-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-gray-500">Progress</span>
                                                            <span className="text-xs text-gray-500">{calculateTaskProgress(task)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                                            <div
                                                                className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(calculateTaskProgress(task))}`}
                                                                style={{ width: `${calculateTaskProgress(task)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <MdPerson className="w-3 h-3" />
                                                        <span>{task.assignedTo}</span>
                                                    </div>
                                                    {task.dueDate && (
                                                        <div className={`flex items-center gap-1 ${isTaskOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                                                            <MdCalendarToday className="w-3 h-3" />
                                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <button
                                            onClick={() => {
                                                setTaskForm(prev => ({ ...prev, status: column.id }));
                                                setShowCreateModal(true);
                                            }}
                                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MdAdd className="w-4 h-4" />
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Task List View</h3>
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <MdAssignment className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm || selectedPriority || selectedStatus || selectedAssignee
                                            ? "Try adjusting your filters."
                                            : "Get started by creating a new task."}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredTasks.map(task => (
                                        <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                        <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                        <span>{task.assignedTo}</span>
                                                        {task.dueDate && (
                                                            <span className={isTaskOverdue(task.dueDate) ? 'text-red-600' : ''}>
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
                                                        onClick={() => handleEditTask(task)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <MdEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
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
                )}

                {/* Task Creation/Edit Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editingTask ? 'Edit Task' : 'Create New Task'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingTask(null);
                                        resetTaskForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <MdClose className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <div className="text-center py-8">
                                    <MdConstruction className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Task Form Coming Soon</h3>
                                    <p className="text-gray-500 mb-6">
                                        The comprehensive task creation form with all Jira-like features including subtasks, 
                                        dependencies, attachments, tags, and time tracking is being developed.
                                    </p>
                                    <div className="bg-blue-50 rounded-lg p-4 text-left">
                                        <h4 className="font-medium text-blue-900 mb-2">Planned Features:</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Rich text description editor</li>
                                            <li>• Subtasks and checklists</li>
                                            <li>• Task dependencies</li>
                                            <li>• File attachments and links</li>
                                            <li>• Tags and labels</li>
                                            <li>• Time tracking and estimation</li>
                                            <li>• Story points and sprint planning</li>
                                            <li>• Comments and mentions</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setEditingTask(null);
                                            resetTaskForm();
                                        }}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Task Details Modal */}
                {showTaskDetails && selectedTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                                        {selectedTask.priority}
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                                        {selectedTask.status}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowTaskDetails(false);
                                        setSelectedTask(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <MdClose className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                                <p className="text-gray-600">{selectedTask.description || 'No description provided.'}</p>
                                            </div>
                                            
                                            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                                        Subtasks ({selectedTask.subtasks.filter(st => st.completed).length}/{selectedTask.subtasks.length})
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {selectedTask.subtasks.map((subtask, index) => (
                                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={subtask.completed}
                                                                    onChange={() => {
                                                                        // Handle subtask completion
                                                                    }}
                                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                                    {subtask.title}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-sm font-medium text-gray-900 mb-3">Task Information</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Assigned to:</span>
                                                    <span className="text-gray-900">{selectedTask.assignedTo}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Created:</span>
                                                    <span className="text-gray-900">{formatDate(selectedTask.createdAt)}</span>
                                                </div>
                                                {selectedTask.dueDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Due Date:</span>
                                                        <span className={`${isTaskOverdue(selectedTask.dueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {new Date(selectedTask.dueDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Estimated:</span>
                                                    <span className="text-gray-900">{selectedTask.estimatedHours}h</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Logged:</span>
                                                    <span className="text-gray-900">{selectedTask.actualHours.toFixed(1)}h</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {selectedTask.tags && selectedTask.tags.length > 0 && (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedTask.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => {
                                                        handleEditTask(selectedTask);
                                                        setShowTaskDetails(false);
                                                    }}
                                                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <MdEdit className="w-4 h-4" />
                                                    Edit Task
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowTaskDetails(false);
                                                        handleDeleteTask(selectedTask.id);
                                                    }}
                                                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <MdDelete className="w-4 h-4" />
                                                    Delete Task
                                                </button>
                                            </div>
                                        </div>
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