import { AppManager } from './app-logic';

export const DOMController = (() => {
    const contentDiv = document.getElementById('content');

    const init = () => {
        renderLayout();
        renderProjects();
        renderTodos();

        // Global click handler to close menus
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-container')) {
                document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('visible'));
            }
        });
    };

    const renderLayout = () => {
        contentDiv.innerHTML = `
            <div id="app-container">
                <aside id="sidebar">
                    <h2>Projects</h2>
                    <ul id="project-list"></ul>
                    <button id="add-project-btn" class="btn primary">+ Add Project</button>
                </aside>
                <main id="main-content">
                    <header id="main-header">
                        <h2 id="project-title">Select a Project</h2>
                    </header>
                    <div id="todos-container"></div>
                    <button id="add-todo-btn" class="btn primary floating-btn">+ Add Task</button>
                </main>
            </div>

            <!-- Add Project Modal -->
            <div id="project-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-btn" data-target="project-modal">&times;</span>
                    <h3>New Project</h3>
                    <form id="project-form">
                        <input type="text" id="project-name-input" placeholder="Project Name" required>
                        <div class="date-group">
                            <label>Start: <input type="date" id="project-start-input"></label>
                            <label>End: <input type="date" id="project-end-input"></label>
                        </div>
                        <button type="submit" class="btn primary">Create Project</button>
                    </form>
                </div>
            </div>

            <!-- Add Todo Modal -->
            <div id="todo-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-btn" data-target="todo-modal">&times;</span>
                    <h3>New Task</h3>
                    <form id="todo-form">
                        <input type="text" id="todo-title-input" placeholder="Task Title" required>
                        <textarea id="todo-desc-input" placeholder="Description"></textarea>
                        <div class="date-group">
                            <label>Start: <input type="date" id="todo-start-input"></label>
                            <label>End: <input type="date" id="todo-end-input"></label>
                        </div>
                        <select id="todo-priority-input">
                            <option value="low">Low Priority</option>
                            <option value="medium" selected>Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <button type="submit" class="btn primary">Add Task</button>
                    </form>
                </div>
            </div>

            <!-- Details Modal -->
            <div id="details-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-btn" data-target="details-modal">&times;</span>
                    <h3 id="details-title">Task Details</h3>
                    <div id="details-body">
                        <p id="details-desc"></p>
                        <p id="details-dates"></p>
                        <p id="details-priority"></p>
                        
                        <hr>
                        <h4>Checklist</h4>
                        <div id="checklist-container"></div>
                        <form id="checklist-form" style="display: flex; margin-top: 10px; gap: 5px;">
                            <input type="text" id="checklist-input" placeholder="Add checklist item..." style="flex: 1;">
                            <button type="submit" class="btn primary">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        setupEventListeners();
    };

    const setupEventListeners = () => {
        // Modal Toggles
        document.getElementById('add-project-btn').addEventListener('click', () => {
            document.getElementById('project-modal').classList.remove('hidden');
        });

        document.getElementById('add-todo-btn').addEventListener('click', () => {
            const activeProject = AppManager.getActiveProject();
            if (!activeProject) {
                alert('Please select or create a project first.');
                return;
            }
            document.getElementById('todo-modal').classList.remove('hidden');
        });

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-target');
                document.getElementById(modalId).classList.add('hidden');
            });
        });

        // Form Submissions
        document.getElementById('project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name-input').value;
            const start = document.getElementById('project-start-input').value;
            const end = document.getElementById('project-end-input').value;

            if (name) {
                const startDate = start ? new Date(start) : null;
                const endDate = end ? new Date(end) : null;
                const newProject = AppManager.createNewProject(name, startDate, endDate);
                AppManager.setActiveProject(newProject.id);
                renderProjects();
                renderTodos();
                e.target.reset();
                document.getElementById('project-modal').classList.add('hidden');
            }
        });

        document.getElementById('todo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('todo-title-input').value;
            const desc = document.getElementById('todo-desc-input').value;
            const startStr = document.getElementById('todo-start-input').value;
            const endStr = document.getElementById('todo-end-input').value;
            const priority = document.getElementById('todo-priority-input').value;

            const startDate = startStr ? new Date(startStr) : null;
            const endDate = endStr ? new Date(endStr) : null;

            if (title) {
                AppManager.addTodoToActiveProject(title, desc, startDate, endDate, priority);
                renderTodos();
                e.target.reset();
                document.getElementById('todo-modal').classList.add('hidden');
            }
        });
    };

    const renderProjects = () => {
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';
        const projects = AppManager.getProjects();
        const activeProject = AppManager.getActiveProject();

        projects.forEach(project => {
            const li = document.createElement('li');
            li.classList.add('project-item');
            if (activeProject && project.id === activeProject.id) {
                li.classList.add('active');
            }

            const nameSpan = document.createElement('span');
            nameSpan.textContent = project.name;
            nameSpan.style.flex = '1';
            nameSpan.addEventListener('click', () => {
                AppManager.setActiveProject(project.id);
                renderProjects();
                renderTodos();
            });
            li.appendChild(nameSpan);

            // Menu
            const menuContainer = document.createElement('div');
            menuContainer.classList.add('menu-container');

            const menuBtn = document.createElement('button');
            menuBtn.textContent = '⋮';
            menuBtn.classList.add('menu-btn');
            menuBtn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('visible'));
                dropdown.classList.toggle('visible');
            };
            menuContainer.appendChild(menuBtn);

            const dropdown = document.createElement('div');
            dropdown.classList.add('dropdown-menu');
            dropdown.innerHTML = `<div class="dropdown-item delete">Delete Project</div>`;
            dropdown.querySelector('.delete').onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Delete "${project.name}" and all its tasks?`)) {
                    AppManager.deleteProject(project.id);
                    renderProjects();
                    renderTodos();
                }
            };
            menuContainer.appendChild(dropdown);

            li.appendChild(menuContainer);
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
                todoDiv.classList.add(`priority-${todo.priority}`);

                const progress = (todo.getProgress) ? todo.getProgress() : 0;
                const startStr = todo.startDate ? new Date(todo.startDate).toLocaleDateString() : '';
                const endStr = todo.endDate ? new Date(todo.endDate).toLocaleDateString() : '';
                const dateRange = (startStr || endStr) ? `${startStr} - ${endStr}` : 'No dates set';

                todoDiv.innerHTML = `
                    <div class="todo-header">
                        <input type="checkbox" ${todo.isComplete ? 'checked' : ''} class="todo-check">
                        <div class="todo-info">
                            <span class="todo-title ${todo.isComplete ? 'completed' : ''}">${todo.title}</span>
                            <span class="todo-date">${dateRange}</span>
                        </div>
                        
                        <div class="task-progress-bar">
                            <div class="task-progress-fill" style="width: ${progress}%"></div>
                        </div>

                        <div class="menu-container">
                            <button class="menu-btn">⋮</button>
                            <div class="dropdown-menu">
                                <div class="dropdown-item delete">Delete Task</div>
                            </div>
                        </div>
                    </div>
                `;

                // Event Listeners
                todoDiv.querySelector('.todo-check').onchange = (e) => {
                    todo.toggleComplete();
                    renderTodos();
                };

                todoDiv.querySelector('.todo-info').onclick = () => {
                    showTaskDetails(todo);
                };

                const menuBtn = todoDiv.querySelector('.menu-btn');
                const dropdown = todoDiv.querySelector('.dropdown-menu');
                menuBtn.onclick = (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('visible'));
                    dropdown.classList.toggle('visible');
                };

                dropdown.querySelector('.delete').onclick = (e) => {
                    e.stopPropagation();
                    activeProject.removeTodo(todo.id);
                    renderTodos();
                };

                todoContainer.appendChild(todoDiv);
            });
        } else {
            projectTitle.textContent = 'Select or Create a Project';
        }
    };

    const showTaskDetails = (todo) => {
        const modal = document.getElementById('details-modal');
        document.getElementById('details-title').textContent = todo.title;
        document.getElementById('details-desc').textContent = todo.description || 'No description provided.';
        document.getElementById('details-priority').textContent = `Priority: ${todo.priority}`;

        const startStr = todo.startDate ? new Date(todo.startDate).toLocaleDateString() : 'N/A';
        const endStr = todo.endDate ? new Date(todo.endDate).toLocaleDateString() : 'N/A';
        document.getElementById('details-dates').textContent = `Dates: ${startStr} to ${endStr}`;

        const checklistContainer = document.getElementById('checklist-container');

        const renderChecklist = () => {
            checklistContainer.innerHTML = '';
            todo.checklist.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('checklist-item');
                itemDiv.innerHTML = `
                    <input type="checkbox" ${item.isComplete ? 'checked' : ''}>
                    <span>${item.text}</span>
                `;
                itemDiv.querySelector('input').onchange = () => {
                    todo.toggleChecklistItem(index);
                    renderChecklist();
                    renderTodos();
                };
                checklistContainer.appendChild(itemDiv);
            });
        };

        renderChecklist();

        const checklistForm = document.getElementById('checklist-form');
        checklistForm.onsubmit = (e) => {
            e.preventDefault();
            const input = document.getElementById('checklist-input');
            if (input.value) {
                todo.addChecklistItem(input.value);
                input.value = '';
                renderChecklist();
                renderTodos();
            }
        };

        modal.classList.remove('hidden');
    };

    return { init };
})();
