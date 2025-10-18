import { useState, useEffect, useCallback } from 'react';
import { createTodo, filterTodos, sortTodos } from '../utils/todoUtils';

const STORAGE_KEY = 'todos-app-data';

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

const addTodo = useCallback((text, options) => {
    const newTodo = createTodo(text, options);
    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
}, []);

const toggleTodo = useCallback((id) => {
    setTodos(prev => 
    prev.map(todo => 
        todo.id === id 
        ? { ...todo, completed: !todo.completed } 
        : todo
    )
    );
}, []);

const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
}, []);

const updateTodo = useCallback((id, updates) => {
    setTodos(prev => 
    prev.map(todo => 
        todo.id === id 
        ? { ...todo, ...updates } 
        : todo
    )
    );
}, []);

const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
}, []);

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