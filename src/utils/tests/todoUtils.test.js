import { describe, it, expect } from 'vitest';
import {
generateId,
validateTodoText,
filterTodos,
sortTodos,
getTodoStats,
createTodo
} from '../todoUtils';

describe('generateId', () => {
it('генерує унікальний ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
});
});

describe('validateTodoText', () => {
it('приймає валідний текст', () => {
    const result = validateTodoText('Купити молоко');
    expect(result).toBe('Купити молоко');
});

it('викидає помилку для порожнього тексту', () => {
    expect(() => validateTodoText('')).toThrow('Todo text cannot be empty');
});
});

describe('filterTodos', () => {
const todos = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true },
    { id: '3', text: 'Task 3', completed: false }
];

it('повертає всі задачі для фільтру "all"', () => {
    const result = filterTodos(todos, 'all');
    expect(result).toHaveLength(3);
});

it('повертає тільки активні задачі', () => {
    const result = filterTodos(todos, 'active');
    expect(result).toHaveLength(2);
});
});

describe('sortTodos', () => {
const todos = [
    { id: '1', text: 'Zulu', createdAt: 1000, priority: 'low' },
    { id: '2', text: 'Alpha', createdAt: 3000, priority: 'high' },
    { id: '3', text: 'Mike', createdAt: 2000, priority: 'medium' }
];

it('сортує за датою створення', () => {
    const result = sortTodos(todos, 'date');
    expect(result[0].id).toBe('2');
});

it('сортує за пріоритетом', () => {
    const result = sortTodos(todos, 'priority');
    expect(result[0].priority).toBe('high');
});
});

describe('getTodoStats', () => {
it('рахує статистику коректно', () => {
    const todos = [
    { completed: true },
    { completed: false },
    { completed: true }
    ];
    const stats = getTodoStats(todos);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(2);
});

it('повертає нульову статистику для порожнього списку', () => {
    const stats = getTodoStats([]);
    expect(stats.total).toBe(0);
});
});

describe('createTodo', () => {
it('створює задачу з базовими полями', () => {
    const todo = createTodo('Test task');
    expect(todo.text).toBe('Test task');
    expect(todo.completed).toBe(false);
    expect(todo.priority).toBe('low');
});

it('валідує текст при створенні', () => {
    expect(() => createTodo('')).toThrow();
});
});