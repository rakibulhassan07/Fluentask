import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import {
    MdAdd,
    MdFilterList,
    MdViewModule,
    MdViewList,
    MdEdit,
    MdDelete,
    MdPerson,
    MdCalendarToday,
    MdClose,
    MdAssignment,
    MdVisibility
} from 'react-icons/md';

const Tasks = () => {
    // Basic state
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban');
    const [selectedAssignee, setSelectedAssignee] = useState('');
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    
    // Drag and drop
    const [draggedTask, setDraggedTask] = useState(null);

    // Sample tasks for demo
    const sampleTasks = [
        {
            id: '1',
            title: 'Design User Authentication Flow',
            description: 'Create wireframes and mockups for the user authentication system',
            priority: 'High',
            status: 'In Progress',
            assignedTo: 'John Doe',
            dueDate: '2024-01-15',
            tags: ['Design', 'Authentication', 'UI/UX'],
            progress: 50
        },
        {
            id: '2',
            title: 'Implement Task Management API',
            description: 'Build REST API endpoints for CRUD operations on tasks',
            priority: 'Critical',
            status: 'To Do',
            assignedTo: 'Jane Smith',
            dueDate: '2024-01-20',
            tags: ['Backend', 'API', 'Database'],
            progress: 0
        },
        {
            id: '3',
            title: 'Write Documentation',
            description: 'Create comprehensive documentation for the project',
            priority: 'Medium',
            status: 'Done',
            assignedTo: 'Mike Johnson',
            dueDate: '2024-01-10',
            tags: ['Documentation', 'Writing'],
            progress: 100
        }
    ];

    // Kanban columns
    const columns = [
        { id: 'To Do', title: 'To Do', color: 'bg-gray-100' },
        { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
        { id: 'In Review', title: 'In Review', color: 'bg-yellow-100' },
        { id: 'Done', title: 'Done', color: 'bg-green-100' }
    ];

    // Load sample data
    useEffect(() => {
        setTasks(sampleTasks);
        setLoading(false);
    }, []);

    // Helper functions
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

    // Filter tasks by assignee
    const filteredTasks = tasks.filter(task => {
        return !selectedAssignee || task.assignedTo === selectedAssignee;
    });

    // Get tasks for specific column
    const getColumnTasks = (status) => {
        return filteredTasks.filter(task => task.status === status);
    };

    // Get unique assignees for filter
    const uniqueAssignees = [...new Set(tasks.map(task => task.assignedTo))];

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
            setTasks(tasks.filter(task => task.id !== taskId));
            toast.success('Task deleted successfully!');
        }
    };

    // Drag and drop functions
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, newStatus) => {
        e.preventDefault();
        if (draggedTask && draggedTask.status !== newStatus) {
            setTasks(tasks.map(task =>
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
                            {/* Filters */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <MdFilterList className="text-gray-500 w-5 h-5" />
                                
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
                                {selectedAssignee && (
                                    <button
                                        onClick={() => {
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
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-all"
                                            >
                                                {/* Task Header */}
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 
                                                        className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600"
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
                                                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
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
                                            </div>
                                        ))}
                                        
                                        {/* Add Task Button */}
                                        <button
                                            onClick={() => setShowCreateModal(true)}
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
                    // List View
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Task List</h3>
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <MdAssignment className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {selectedAssignee ? "Try clearing the filter." : "Get started by creating a new task."}
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
                                                        onClick={() => handleDelete(task.id)}
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

                {/* Simple Create Task Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <MdClose className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="p-6 text-center">
                                <div className="mb-4">
                                    <MdAdd className="mx-auto h-16 w-16 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Task Creation Form</h3>
                                <p className="text-gray-500 mb-6">
                                    The task creation form will be implemented here with fields for title, description, 
                                    priority, assignee, due date, and more.
                                </p>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
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
                                                handleDelete(selectedTask.id);
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
