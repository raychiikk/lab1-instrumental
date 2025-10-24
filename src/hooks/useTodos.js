import { useState, useEffect, useCallback } from 'react';
import { createTodo, filterTodos, sortTodos } from '../utils/todoUtils';

const STORAGE_KEY = 'todos-app-data';

/**
 * @typedef {object} Todo
 * @property {string} id - Унікальний ID.
 * @property {string} text - Текст задачі.
 * @property {boolean} completed - Статус виконання.
 * @property {number} createdAt - Час створення (timestamp).
 * @property {string} priority - Пріоритет ('low', 'medium', 'high').
 */

/**
 * @typedef {object} UseTodosReturn
 * @property {Array<Todo>} todos - Відфільтровані та відсортовані задачі.
 * @property {Array<Todo>} allTodos - Повний список задач (до фільтрації).
 * @property {string} filter - Поточний фільтр ('all', 'active', 'completed').
 * @property {function(string): void} setFilter - Функція для зміни фільтра.
 * @property {string} sortBy - Поточний метод сортування.
 * @property {function(string): void} setSortBy - Функція для зміни сортування.
 * @property {function(string, object): Todo} addTodo - Функція додавання нової задачі.
 * @property {function(string): void} toggleTodo - Функція перемикання статусу задачі.
 * @property {function(string): void} deleteTodo - Функція видалення задачі.
 * @property {function(string, object): void} updateTodo - Функція оновлення задачі.
 * @property {function(): void} clearCompleted - Функція видалення виконаних.
 * @property {function(): void} clearAll - Функція видалення всіх задач.
 */

/**
 * Кастомний хук React для управління списком задач.
 * Забезпечує повний CRUD, фільтрацію, сортування та синхронізацію з localStorage.
 * * @brief Головний хук для логіки Todo-додатку.
 * @returns {UseTodosReturn} Об'єкт з станом та функціями для управління задачами.
 */
export const useTodos = () => {
const [todos, setTodos] = useState([]);
const [filter, setFilter] = useState('all');
const [sortBy, setSortBy] = useState('date');

// Завантаження з localStorage при монтуванні
useEffect(() => {
const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
    try {
        const parsed = JSON.parse(stored);
        setTodos(parsed);
    } catch (error) {
        console.error('Failed to parse todos from localStorage', error);
    }}}, []);

 // Збереження в localStorage при зміні
useEffect(() => {
    if (todos.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
}, [todos]);

/**
 * Додає нову задачу до списку.
 * @param {string} text - Текст задачі.
 * @param {object} options - Додаткові опції (пріоритет тощо).
 * @returns {Todo} Створена задача.
 */
const addTodo = useCallback((text, options) => {
    const newTodo = createTodo(text, options);
    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
}, []);

/**
 * Змінює статус (completed) задачі за її ID.
 * @param {string} id - ID задачі для перемикання.
 */
const toggleTodo = useCallback((id) => {
    setTodos(prev => 
    prev.map(todo => 
        todo.id === id 
        ? { ...todo, completed: !todo.completed } 
        : todo
    )
    );
}, []);

/**
 * Видаляє задачу за її ID.
 * @param {string} id - ID задачі для видалення.
 */
const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
}, []);

/**
 * Оновлює поля задачі за її ID.
 * @param {string} id - ID задачі для оновлення.
 * @param {object} updates - Об'єкт з полями, які треба оновити.
 */
const updateTodo = useCallback((id, updates) => {
    setTodos(prev => 
    prev.map(todo => 
        todo.id === id 
        ? { ...todo, ...updates } 
        : todo
    )
    );
}, []);

/**
 * Видаляє всі виконані задачі.
 */
const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
}, []);

/**
 * Видаляє всі задачі та очищує localStorage.
 */
const clearAll = useCallback(() => {
    setTodos([]);
    localStorage.removeItem(STORAGE_KEY);
}, []);

const filteredAndSortedTodos = sortTodos(filterTodos(todos, filter), sortBy);

return {
    todos: filteredAndSortedTodos, 
    allTodos: todos,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    clearAll
};
};