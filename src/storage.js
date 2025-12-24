export const Storage = (() => {
    const STORAGE_KEY = 'todo_app_data';

    const save = (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    };

    const load = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    };

    const clear = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return { save, load, clear };
})();
