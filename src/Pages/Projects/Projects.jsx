import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import useAxiosPublic from '../../Hook/useAxiosPublic';
import { toast } from 'react-toastify';
import {
    MdGroup,
    MdAssignment,
    MdCheckCircle,
    MdCalendarToday
} from 'react-icons/md';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    // State management
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Fetch all required data
            const [usersResponse, teamsResponse, tasksResponse] = await Promise.all([
                axiosPublic.get('/users'),
                axiosPublic.get('/teams'),
                axiosPublic.get('/tasks')
            ]);

            const usersData = usersResponse.data;
            const teamsData = teamsResponse.data;
            const tasksData = tasksResponse.data;

            setUsers(usersData);
            setTeams(teamsData);
            setTasks(tasksData);

            // Process projects from teams data
            const projectsMap = new Map();

            teamsData.forEach(team => {
                if (team.project && team.project.trim()) {
                    const projectName = team.project.trim();
                    
                    if (!projectsMap.has(projectName)) {
                        projectsMap.set(projectName, {
                            name: projectName,
                            teams: [],
                            members: new Set(),
                            leaders: new Set(),
                            tasks: [],
                            createdAt: team.createdAt || new Date().toISOString()
                        });
                    }

                    const project = projectsMap.get(projectName);
                    project.teams.push(team);

                    // Add team leader
                    const leader = usersData.find(u => u._id === team.leader);
                    if (leader) {
                        project.leaders.add(leader);
                        project.members.add(leader);
                    }

                    // Add team members
                    if (team.members && Array.isArray(team.members)) {
                        team.members.forEach(memberId => {
                            const member = usersData.find(u => u._id === memberId);
                            if (member) {
                                project.members.add(member);
                            }
                        });
                    }

                    // Add tasks for this project (filter by team)
                    const projectTasks = tasksData.filter(task => 
                        task.teamId === team._id || task.project === projectName
                    );
                    project.tasks.push(...projectTasks);
                }
            });

            // Convert Map to Array and process members as arrays
            const projectsArray = Array.from(projectsMap.values()).map(project => ({
                ...project,
                members: Array.from(project.members),
                leaders: Array.from(project.leaders),
                memberCount: project.members.size,
                teamCount: project.teams.length,
                taskCount: project.tasks.length,
                completedTasks: project.tasks.filter(task => task.status === 'Done').length,
                completionRate: project.tasks.length > 0 ? 
                    Math.round((project.tasks.filter(task => task.status === 'Done').length / project.tasks.length) * 100) : 0
            }));

            // Filter projects to only show those where current user is involved
            const userProjects = projectsArray.filter(project => {
                if (!user) return false;
                
                // Check if current user is involved in this project
                return project.members.some(member => 
                    member.email === user.email || 
                    member._id === user.uid ||
                    member._id === user._id
                );
            });

            setProjects(userProjects);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch project data');
            setLoading(false);
        }
    };



    const getUserInitials = (user) => {
        if (user.name) {
            return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return user.email ? user.email[0].toUpperCase() : 'U';
    };



    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">My Projects</h1>
                <p className="text-lg text-gray-600 mb-6">
                    Projects where you are involved as a team member or leader
                </p>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-12">
                    <MdAssignment className="mx-auto h-24 w-24 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                    <p className="mt-2 text-gray-500">
                        You are not currently involved in any projects as a team member or leader.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project.name} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            {/* Project Header */}
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {project.teamCount} team{project.teamCount !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Project Stats */}
                            <div className="p-6 grid grid-cols-3 gap-4 text-center border-b border-gray-200">
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{project.memberCount}</div>
                                    <div className="text-xs text-gray-500">Members</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{project.taskCount}</div>
                                    <div className="text-xs text-gray-500">Tasks</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-green-600">{project.completedTasks}</div>
                                    <div className="text-xs text-gray-500">Done</div>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="p-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Team Members</h4>
                                <div className="space-y-2">
                                    {project.members.slice(0, 5).map((member) => (
                                        <div key={member._id} className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                                                {getUserInitials(member)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {member.name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                            </div>
                                            {project.leaders.some(leader => leader._id === member._id) && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Leader
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {project.members.length > 5 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            +{project.members.length - 5} more members
                                        </p>
                                    )}
                                </div>
                            </div>

                          
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;