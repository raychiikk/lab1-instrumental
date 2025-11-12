/**
 * @file Утиліти для роботи з задачами (todos).
 * @module utils/todoUtils
 */

/**
 * Генерує унікальний ID для задачі на основі часу та випадкового рядка.
 * @brief Генерує унікальний ID.
 * @returns {string} Унікальний ID у форматі "timestamp-random".
 * @example
 * const id = generateId();
 * // "1678886400000-1a2b3c4d5"
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Валідує текст задачі.
 * @brief Валідує текст задачі.
 * @param {string} text - Текст для валідації.
 * @returns {string} Очищений (обрізаний) текст.
 * @throws {Error} Викидає помилку, якщо текст не є рядком, порожній, або довший за 200 символів.
 */
export const validateTodoText = (text) => {
    if (typeof text !== 'string') {
    throw new Error('Todo text must be a string');
    }
    
    const trimmed = text.trim();
    
    if (trimmed.length === 0) {
    throw new Error('Todo text cannot be empty');
    }
    
    if (trimmed.length > 200) {
    throw new Error('Todo text is too long (max 200 characters)');
    }
    
    return trimmed;
};

/**
 * Фільтрує масив задач за статусом.
 * @brief Фільтрує задачі.
 * @param {Array<object>} todos - Масив задач.
 * @param {string} filter - Тип фільтру ('all', 'active', 'completed').
 * @returns {Array<object>} Відфільтрований масив задач.
 */
export const filterTodos = (todos, filter) => {
    switch (filter) {
    case 'active':
        return todos.filter(todo => !todo.completed);
    case 'completed':
        return todos.filter(todo => todo.completed);
    case 'all':
    default:
        return todos;
    }
};

/**
 * Сортує масив задач за обраним критерієм.
 * @brief Сортує задачі.
 * @param {Array<object>} todos - Масив задач.
 * @param {string} [sortBy='date'] - Критерій сортування ('date', 'alphabetical', 'priority').
 * @returns {Array<object>} Відсортований масив задач.
 */
export const sortTodos = (todos, sortBy = 'date') => {
    const todosCopy = [...todos];
    
    switch (sortBy) {
    case 'date':
        return todosCopy.sort((a, b) => b.createdAt - a.createdAt);
    case 'alphabetical':
        return todosCopy.sort((a, b) => a.text.localeCompare(b.text));
    case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return todosCopy.sort((a, b) => {
        return priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
        });
    default:
        return todosCopy;
    }
};

/**
 * @typedef {object} TodoStats
 * @property {number} total - Загальна кількість задач.
 * @property {number} completed - Кількість виконаних задач.
 * @property {number} active - Кількість активних задач.
 * @property {number} completionRate - Відсоток виконання (0-100).
 */

/**
 * Рахує статистику задач.
 * @brief Отримує статистику задач.
 * @param {Array<object>} todos - Масив задач.
 * @returns {TodoStats} Об'єкт зі статистикою.
 */
export const getTodoStats = (todos) => {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    return {
    total: total,
    completed: completed,
    active: total - completed,
    completionRate: total > 0 
        ? Math.round((completed / total) * 100) 
        : 0
    };
};

/**
 * @typedef {object} TodoOptions
 * @property {string} [priority='low'] - Пріоритет задачі.
 * @property {string|null} [dueDate=null] - Дата виконання.
 * @property {Array<string>} [tags=[]] - Теги задачі.
 */

/**
 * Створює новий об'єкт задачі.
 * @brief Створює нову задачу.
 * @param {string} text - Текст задачі.
 * @param {TodoOptions} [options={}] - Додаткові опції.
 * @returns {object} Новий об'єкт задачі.
 * @throws {Error} Викидає помилку валідації з `validateTodoText`.
 * @example
 * // Створення простої задачі
 * const todo1 = createTodo("Купити молоко");
 * * // Створення задачі з опціями
 * const todo2 = createTodo("Зробити ЛР", { priority: 'high' });
 */
export const createTodo = (text, options = {}) => {
    const validatedText = validateTodoText(text);
    
    return {
    id: generateId(),
    text: validatedText,
    completed: false,
    createdAt: Date.now(),
    priority: options.priority || 'low',
    dueDate: options.dueDate || null,
    tags: options.tags || []
    };
};