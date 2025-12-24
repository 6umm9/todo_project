export function createProject(name) {
    const id = crypto.randomUUID();
    const todos = [];

    return {
        id,
        name,
        todos,
        addTodo(todo) {
            todos.push(todo);
        },
        removeTodo(todoId) {
            const index = todos.findIndex(t => t.id === todoId);
            if (index > -1) todos.splice(index, 1);
        },
        getTodos() { return todos; }
    };
}
