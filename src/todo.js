export function createTodo(title, description, startDate, endDate, priority, notes = '', checklist = []) {
    const id = crypto.randomUUID();
    let isComplete = false;

    return {
        id,
        title,
        description,
        startDate,
        endDate,
        priority,
        notes,
        checklist,
        get isComplete() { return isComplete; },
        set isComplete(value) { isComplete = value; },
        toggleComplete() { isComplete = !isComplete; },
        addChecklistItem(text) {
            checklist.push({ text, isComplete: false });
        },
        toggleChecklistItem(index) {
            if (checklist[index]) {
                checklist[index].isComplete = !checklist[index].isComplete;
            }
        },
        getProgress() {
            if (checklist.length === 0) return 0;
            const completed = checklist.filter(i => i.isComplete).length;
            return Math.round((completed / checklist.length) * 100);
        }
    };
}
