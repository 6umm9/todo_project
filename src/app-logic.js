import { createProject } from './project';
import { createTodo } from './todo';
import { Storage } from './storage';

export const AppManager = (() => {
    let projects = [];
    let activeProjectId = null;

    const init = () => {
        const savedData = Storage.load();
        if (savedData && savedData.length > 0) {
            projects = restoreData(savedData);
            activeProjectId = projects[0].id;
        } else {
            const defaultProject = createProject('Default Project');
            projects.push(defaultProject);
            activeProjectId = defaultProject.id;

            const sampleTodo = createTodo(
                'Welcome to your Todo App!',
                'This is a sample task. Feel free to delete it.',
                new Date(),
                null,
                'medium'
            );
            defaultProject.addTodo(sampleTodo);
            save(); // Save the initial state
        }
    };

    const restoreData = (data) => {
        return data.map(projData => {
            const project = createProject(projData.name, projData.color);
            project.id = projData.id; // Preserve ID

            projData.todos.forEach(todoData => {
                const todo = createTodo(
                    todoData.title,
                    todoData.description,
                    todoData.startDate ? new Date(todoData.startDate) : null,
                    todoData.endDate ? new Date(todoData.endDate) : null,
                    todoData.priority,
                    todoData.notes,
                    todoData.checklist
                );
                todo.id = todoData.id; // Preserve ID
                todo.isComplete = todoData.isComplete;
                if (todoData.manualProgress !== undefined) {
                    todo.manualProgress = todoData.manualProgress;
                }
                project.addTodo(todo);
            });
            return project;
        });
    };

    const save = () => {
        // We only want to save the state, not the methods
        // project.getTodos() returns the array which JSON.stringify handles
        // But projects themselves are objects with methods.
        // JSON.stringify strips methods, which is what we want for storage.
        Storage.save(projects);
    };

    const getProjects = () => projects;

    const getActiveProject = () => {
        return projects.find(p => p.id === activeProjectId);
    };

    const setActiveProject = (id) => {
        activeProjectId = id;
    };

    const createNewProject = (name, color) => {
        const newProject = createProject(name, color);
        projects.push(newProject);
        save();
        return newProject;
    };

    const updateProject = (projectId, newData) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            if (newData.name) project.name = newData.name;
            if (newData.color) project.color = newData.color;
            save();
        }
    };

    const deleteProject = (projectId) => {
        projects = projects.filter(p => p.id !== projectId);
        if (activeProjectId === projectId) {
            activeProjectId = projects.length > 0 ? projects[0].id : null;
        }
        save();
    };

    const addTodoToActiveProject = (title, description, startDate, endDate, priority) => {
        const activeProject = getActiveProject();
        if (activeProject) {
            const newTodo = createTodo(title, description, startDate, endDate, priority);
            activeProject.addTodo(newTodo);
            save();
        }
    };

    return {
        init,
        save, // Expose save for manual triggers from UI if needed
        getProjects,
        getActiveProject,
        setActiveProject,
        createNewProject,
        updateProject,
        deleteProject,
        addTodoToActiveProject
    };
})();
