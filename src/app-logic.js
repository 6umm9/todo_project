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

    const createNewProject = (name) => {
        const newProject = createProject(name);
        projects.push(newProject);
        return newProject;
    };

    return {
        init,
        getProjects,
        getActiveProject,
        setActiveProject,
        createNewProject
    };
})();
