import { AppManager } from './app-logic';

export const DOMController = (() => {
    const contentDiv = document.getElementById('content');
    let currentEditProjectId = null;
    let currentEditTodoId = null;

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
                    <h2 style="margin-top: 0;">Projects</h2>
                    <ul id="project-list" style="list-style: none; padding: 0;"></ul>
                    <button id="add-project-btn" class="btn primary" style="margin-top: 10px;">+ Add Project</button>
                </aside>
                <main id="main-content">
                    <header id="main-header" style="border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 25px;">
                        <h2 id="project-title" style="margin: 0;">Select a Project</h2>
                    </header>
                    <div id="todos-container"></div>
                    <button id="add-todo-btn" class="btn primary floating-btn" style="margin-top: 20px;">+ Add Task</button>
                </main>
            </div>

            <!-- Project Modal (New/Edit) -->
            <div id="project-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-btn" data-target="project-modal">&times;</span>
                    <h3 id="project-modal-title">New Project</h3>
                    <form id="project-form">
                        <div class="form-group">
                            <label for="project-name-input">Project Name</label>
                            <input type="text" id="project-name-input" placeholder="Project Name" required>
                        </div>
                        <div class="form-group">
                            <label for="project-color-input">Project Color</label>
                            <input type="color" id="project-color-input" value="#1976d2" style="height: 50px; padding: 5px;">
                        </div>
                        <button type="submit" class="btn primary" id="project-submit-btn">Create Project</button>
                    </form>
                </div>
            </div>

            <!-- Todo Modal (New/Edit) -->
            <div id="todo-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-btn" data-target="todo-modal">&times;</span>
                    <h3 id="todo-modal-title">New Task</h3>
                    <form id="todo-form">
                        <div class="form-group">
                            <label for="todo-title-input">Task Title</label>
                            <input type="text" id="todo-title-input" placeholder="Task Title" required>
                        </div>
                        <div class="form-group">
                            <label for="todo-desc-input">Description</label>
                            <textarea id="todo-desc-input" placeholder="Optional details..."></textarea>
                        </div>
                        <div class="date-group">
                            <div class="form-group">
                                <label for="todo-start-input">Start Date</label>
                                <input type="date" id="todo-start-input">
                            </div>
                            <div class="form-group">
                                <label for="todo-end-input">End Date</label>
                                <input type="date" id="todo-end-input">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="todo-priority-input">Priority</label>
                            <select id="todo-priority-input">
                                <option value="low">Low Priority</option>
                                <option value="medium" selected>Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                        <button type="submit" class="btn primary" id="todo-submit-btn">Add Task</button>
                    </form>
                </div>
            </div>

            <!-- Details Modal -->
            <div id="details-modal" class="modal hidden">
                <div class="modal-content">
                    <span class="close-btn" data-target="details-modal">&times;</span>
                    <h3 id="details-title">Task Details</h3>
                    <div id="details-body">
                        <p id="details-desc" style="color: #666;"></p>
                        <div style="font-size: 14px; color: #444; display: flex; flex-direction: column; gap: 5px;">
                            <span id="details-dates"></span>
                            <span id="details-priority"></span>
                        </div>
                        
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                        
                        <h4>Checklist</h4>
                        <div id="checklist-container"></div>
                        <form id="checklist-form" style="display: flex; margin-top: 10px; gap: 10px;">
                            <input type="text" id="checklist-input" placeholder="Add checklist item..." style="flex: 1;">
                            <button type="submit" class="btn primary">Add</button>
                        </form>

                        <!-- Manual Progress Adjustment -->
                        <div class="progress-adjust-group">
                             <label for="manual-progress">Adjust Progress (%):</label>
                             <div style="display: flex; align-items: center; gap: 15px;">
                                <input type="range" id="manual-progress" min="0" max="100" step="5" style="flex: 1;">
                                <span id="manual-progress-value" style="font-weight: bold; width: 40px;">0%</span>
                             </div>
                             <p style="font-size: 11px; color: #999; margin-top: 5px;">Note: Checklist completion normally determines progress, but you can override it here.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setupEventListeners();
    };

    const setupEventListeners = () => {
        // Modal Toggles
        document.getElementById('add-project-btn').onclick = () => {
            currentEditProjectId = null;
            document.getElementById('project-modal-title').textContent = 'New Project';
            document.getElementById('project-submit-btn').textContent = 'Create Project';
            document.getElementById('project-form').reset();
            document.getElementById('project-modal').classList.remove('hidden');
        };

        document.getElementById('add-todo-btn').onclick = () => {
            const activeProject = AppManager.getActiveProject();
            if (!activeProject) {
                alert('Please select or create a project first.');
                return;
            }
            currentEditTodoId = null;
            document.getElementById('todo-modal-title').textContent = 'New Task';
            document.getElementById('todo-submit-btn').textContent = 'Add Task';
            document.getElementById('todo-form').reset();
            document.getElementById('todo-modal').classList.remove('hidden');
        };

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.onclick = (e) => {
                const modalId = e.target.getAttribute('data-target');
                document.getElementById(modalId).classList.add('hidden');
            };
        });

        // Form Submissions
        document.getElementById('project-form').onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById('project-name-input').value;
            const color = document.getElementById('project-color-input').value;

            if (currentEditProjectId) {
                AppManager.updateProject(currentEditProjectId, { name, color });
            } else {
                const newProj = AppManager.createNewProject(name, color);
                AppManager.setActiveProject(newProj.id);
            }

            renderProjects();
            renderTodos();
            document.getElementById('project-modal').classList.add('hidden');
        };

        document.getElementById('todo-form').onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById('todo-title-input').value;
            const desc = document.getElementById('todo-desc-input').value;
            const start = document.getElementById('todo-start-input').value;
            const end = document.getElementById('todo-end-input').value;
            const priority = document.getElementById('todo-priority-input').value;

            const startDate = start ? new Date(start) : null;
            const endDate = end ? new Date(end) : null;

            if (currentEditTodoId) {
                const activeProject = AppManager.getActiveProject();
                const todo = activeProject.getTodos().find(t => t.id === currentEditTodoId);
                if (todo) {
                    todo.title = title;
                    todo.description = desc;
                    todo.startDate = startDate;
                    todo.endDate = endDate;
                    todo.priority = priority;
                }
            } else {
                AppManager.addTodoToActiveProject(title, desc, startDate, endDate, priority);
            }

            renderTodos();
            document.getElementById('todo-modal').classList.add('hidden');
        };
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

            const leftSide = document.createElement('div');
            leftSide.style.display = 'flex';
            leftSide.style.alignItems = 'center';
            leftSide.style.flex = '1';

            const colorDot = document.createElement('span');
            colorDot.classList.add('project-color-dot');
            colorDot.style.backgroundColor = project.color;
            leftSide.appendChild(colorDot);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = project.name;
            leftSide.appendChild(nameSpan);

            leftSide.onclick = () => {
                AppManager.setActiveProject(project.id);
                renderProjects();
                renderTodos();
            };
            li.appendChild(leftSide);

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
            dropdown.innerHTML = `
                <div class="dropdown-item edit">Edit Project</div>
                <div class="dropdown-item delete">Delete Project</div>
            `;

            dropdown.querySelector('.edit').onclick = (e) => {
                e.stopPropagation();
                currentEditProjectId = project.id;
                document.getElementById('project-modal-title').textContent = 'Edit Project';
                document.getElementById('project-submit-btn').textContent = 'Save Changes';
                document.getElementById('project-name-input').value = project.name;
                document.getElementById('project-color-input').value = project.color;
                document.getElementById('project-modal').classList.remove('hidden');
            };

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
            projectTitle.style.color = activeProject.color;

            activeProject.getTodos().forEach(todo => {
                const todoDiv = document.createElement('div');
                todoDiv.classList.add('todo-item');
                todoDiv.classList.add(`priority-${todo.priority}`);

                // In case logic was overwritten but manual override was added
                let progress = 0;
                if (todo.manualProgress !== undefined) {
                    progress = todo.manualProgress;
                } else if (todo.getProgress) {
                    progress = todo.getProgress();
                }

                const isValidDate = (d) => d instanceof Date && !isNaN(d);
                const startStr = isValidDate(new Date(todo.startDate)) ? new Date(todo.startDate).toLocaleDateString() : '';
                const endStr = isValidDate(new Date(todo.endDate)) ? new Date(todo.endDate).toLocaleDateString() : '';
                const dateRange = (startStr || endStr) ? `${startStr} - ${endStr}` : 'No dates set';

                todoDiv.innerHTML = `
                    <div class="todo-header">
                        <input type="checkbox" ${todo.isComplete ? 'checked' : ''} class="todo-check">
                        <div class="todo-info">
                            <span class="todo-title ${todo.isComplete ? 'completed' : ''}">${todo.title}</span>
                            <span class="todo-date">${dateRange}</span>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; align-items: flex-end;">
                            <span style="font-size: 10px; color: #999; margin-bottom: 2px;">${progress}%</span>
                            <div class="task-progress-bar">
                                <div class="task-progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>

                        <div class="menu-container">
                            <button class="menu-btn">⋮</button>
                            <div class="dropdown-menu">
                                <div class="dropdown-item edit">Edit Task</div>
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

                dropdown.querySelector('.edit').onclick = (e) => {
                    e.stopPropagation();
                    currentEditTodoId = todo.id;
                    document.getElementById('todo-modal-title').textContent = 'Edit Task';
                    document.getElementById('todo-submit-btn').textContent = 'Save Changes';

                    document.getElementById('todo-title-input').value = todo.title;
                    document.getElementById('todo-desc-input').value = todo.description || '';
                    document.getElementById('todo-start-input').value = todo.startDate ? new Date(todo.startDate).toISOString().split('T')[0] : '';
                    document.getElementById('todo-end-input').value = todo.endDate ? new Date(todo.endDate).toISOString().split('T')[0] : '';
                    document.getElementById('todo-priority-input').value = todo.priority;

                    document.getElementById('todo-modal').classList.remove('hidden');
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
            projectTitle.style.color = '#333';
        }
    };

    const showTaskDetails = (todo) => {
        const modal = document.getElementById('details-modal');
        document.getElementById('details-title').textContent = todo.title;
        document.getElementById('details-desc').textContent = todo.description || 'No description provided.';
        document.getElementById('details-priority').textContent = `Priority: ${todo.priority}`;

        const isValidDate = (d) => d instanceof Date && !isNaN(d);
        const startStr = isValidDate(new Date(todo.startDate)) ? new Date(todo.startDate).toLocaleDateString() : 'N/A';
        const endStr = isValidDate(new Date(todo.endDate)) ? new Date(todo.endDate).toLocaleDateString() : 'N/A';
        document.getElementById('details-dates').textContent = `Dates: ${startStr} to ${endStr}`;

        // Progress Slider
        const slider = document.getElementById('manual-progress');
        const sliderVal = document.getElementById('manual-progress-value');

        // Initial value based on checklist if no manual override exists
        let currentProgress = (todo.manualProgress !== undefined) ? todo.manualProgress : (todo.getProgress ? todo.getProgress() : 0);
        slider.value = currentProgress;
        sliderVal.textContent = `${currentProgress}%`;

        slider.oninput = (e) => {
            const val = e.target.value;
            sliderVal.textContent = `${val}%`;
            todo.manualProgress = parseInt(val);
            renderTodos();
        };

        // Checklist Render
        const checklistContainer = document.getElementById('checklist-container');
        const renderChecklist = () => {
            checklistContainer.innerHTML = '';
            todo.checklist.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('checklist-item');
                itemDiv.innerHTML = `
                    <input type="checkbox" ${item.isComplete ? 'checked' : ''}>
                    <span style="${item.isComplete ? 'text-decoration: line-through; color: #888;' : ''}">${item.text}</span>
                `;
                itemDiv.querySelector('input').onchange = () => {
                    todo.toggleChecklistItem(index);
                    delete todo.manualProgress;
                    const newProg = todo.getProgress();
                    slider.value = newProg;
                    sliderVal.textContent = `${newProg}%`;
                    renderChecklist();
                    renderTodos();
                    AppManager.save(); // Persist checklist toggle
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
                delete todo.manualProgress;
                renderChecklist();
                renderTodos();
                AppManager.save(); // Persist new checklist item
            }
        };

        // Progress Slider save
        slider.onchange = () => {
            AppManager.save(); // Save on mouse release
        };

        modal.classList.remove('hidden');
    };

    return { init };
})();
