export function createTodo(title, description, dueDate, priority, notes = '', checklist = []) {
    const id = crypto.randomUUID();
    let isComplete = false;

    return {
        id,
        title,
        description,
        dueDate,
        priority,
        notes,
        checklist,
        get isComplete() { return isComplete; },
        set isComplete(value) { isComplete = value; },
        toggleComplete() { isComplete = !isComplete; }
    };
}
