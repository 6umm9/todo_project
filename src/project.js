export function createProject(name, startDate = null, endDate = null) {
    const id = crypto.randomUUID();
    const todos = [];

    return {
        id,
        name,
        startDate,
        endDate,
        todos,
        addTodo(todo) {
            todos.push(todo);
        },
        removeTodo(todoId) {
            const index = todos.findIndex(t => t.id === todoId);
            if (index > -1) todos.splice(index, 1);
        },
        getTodos() { return todos; },
        getProgress() {
            if (todos.length === 0) return 0;
            const completed = todos.filter(t => t.isComplete).length;
            return Math.round((completed / todos.length) * 100);
        }
    };
}
