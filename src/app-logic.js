import { createProject } from './project';
import { createTodo } from './todo';

export const AppManager = (() => {
    let projects = [];
    let activeProjectId = null;

    const init = () => {
        // Placeholder for loading from storage later
        if (projects.length === 0) {
            const defaultProject = createProject('Default Project');
            projects.push(defaultProject);
            activeProjectId = defaultProject.id;

            // Add a sample todo
            const sampleTodo = createTodo(
                'Welcome to your Todo App!',
                'This is a sample task. Feel free to delete it.',
                new Date(),
                'medium'
            );
            defaultProject.addTodo(sampleTodo);
        }
    };

    const getProjects = () => projects;

    const getActiveProject = () => {
        return projects.find(p => p.id === activeProjectId);
    };

    const setActiveProject = (id) => {
        activeProjectId = id;
    };

    const createNewProject = (name, startDate, endDate) => {
        const newProject = createProject(name, startDate, endDate);
        projects.push(newProject);
        return newProject;
    };

    const deleteProject = (projectId) => {
        // Prevent deleting the only project or default if we want to enforce one
        projects = projects.filter(p => p.id !== projectId);
        if (activeProjectId === projectId) {
            // Switch to the first project available or null
            activeProjectId = projects.length > 0 ? projects[0].id : null;
        }
    };

    const addTodoToActiveProject = (title, description, startDate, endDate, priority) => {
        const activeProject = getActiveProject();
        if (activeProject) {
            const newTodo = createTodo(title, description, startDate, endDate, priority);
            activeProject.addTodo(newTodo);
        }
    };

    return {
        init,
        getProjects,
        getActiveProject,
        setActiveProject,
        createNewProject,
        deleteProject,
        addTodoToActiveProject
    };
})();
