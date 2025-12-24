import { AppManager } from './app-logic';

export const DOMController = (() => {
    const contentDiv = document.getElementById('content');

    const init = () => {
        renderLayout();
        renderProjects();
        renderTodos();
    };

    const renderLayout = () => {
        contentDiv.innerHTML = `
            <div id="app-container">
                <aside id="sidebar">
                    <h2>Projects</h2>
                    <ul id="project-list"></ul>
                    <button id="add-project-btn">+ Add Project</button>
                </aside>
                <main id="main-content">
                    <header id="main-header">
                        <h2 id="project-title"></h2>
                    </header>
                    <div id="todos-container"></div>
                    <button id="add-todo-btn">+ Add Task</button>
                </main>
            </div>
        `;
    };

    const renderProjects = () => {
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';
        const projects = AppManager.getProjects();
        const activeProject = AppManager.getActiveProject();

        projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project.name;
            li.classList.add('project-item');
            if (project.id === activeProject.id) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                AppManager.setActiveProject(project.id);
                renderProjects();
                renderTodos();
            });
            projectList.appendChild(li);
        });
    };

    const renderTodos = () => {
        const todoContainer = document.getElementById('todos-container');
        const projectTitle = document.getElementById('project-title');
        const activeProject = AppManager.getActiveProject();

        todoContainer.innerHTML = '';
        if (activeProject) {
            projectTitle.textContent = activeProject.name;
            activeProject.getTodos().forEach(todo => {
                const todoDiv = document.createElement('div');
                todoDiv.classList.add('todo-item');
                todoDiv.innerHTML = `
                    <div class="todo-header">
                        <input type="checkbox" ${todo.isComplete ? 'checked' : ''}>
                        <span class="todo-title">${todo.title}</span>
                        <span class="todo-date">${todo.dueDate ? todo.dueDate.toLocaleDateString() : 'No Date'}</span>
                    </div>
                `;
                todoContainer.appendChild(todoDiv);
            });
        }
    };

    return { init };
})();
