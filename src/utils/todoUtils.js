/**
 * Генерує унікальний ID для задачі
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
   * Валідує текст задачі
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
   * Фільтрує задачі за статусом
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
   * Сортує задачі
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
   * Рахує статистику задач
   */
export const getTodoStats = (todos) => {
    return {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    completionRate: todos.length > 0 
        ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100) 
        : 0
    };
};

/**
   * Створює нову задачу
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