import { describe, it, expect, vi } from 'vitest';
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

it('генерує ID у правильному форматі', () => {
    const id = generateId();
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
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

it('приймає текст довжиною рівно 200 символів', () => {
    const text = 'a'.repeat(200);
    expect(() => validateTodoText(text)).not.toThrow();
});
});

describe('filterTodos', () => {
const todos = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true },
    { id: '3', text: 'Task 3', completed: false },
    { id: '4', text: 'Task 4', completed: true }
];

it('повертає всі задачі для фільтру "all"', () => {
    const result = filterTodos(todos, 'all');
    expect(result).toHaveLength(4);
});

it('повертає тільки активні задачі', () => {
    const result = filterTodos(todos, 'active');
    expect(result).toHaveLength(2);
    expect(result.every(todo => !todo.completed)).toBe(true);
});

it('повертає тільки виконані задачі', () => {
    const result = filterTodos(todos, 'completed');
    expect(result).toHaveLength(2);
    expect(result.every(todo => todo.completed)).toBe(true);
});
});

describe('sortTodos', () => {
const todos = [
    { id: '1', text: 'Zulu', createdAt: 1000, priority: 'low' },
    { id: '2', text: 'Alpha', createdAt: 3000, priority: 'high' },
    { id: '3', text: 'Mike', createdAt: 2000, priority: 'medium' }
];

it('сортує за датою створення (новіші перші)', () => {
    const result = sortTodos(todos, 'date');
    expect(result[0].id).toBe('2');
    expect(result[2].id).toBe('1');
});

it('сортує за пріоритетом', () => {
    const result = sortTodos(todos, 'priority');
    expect(result[0].priority).toBe('high');
    expect(result[1].priority).toBe('medium');
    expect(result[2].priority).toBe('low');
});
});

describe('getTodoStats', () => {
it('рахує статистику коректно', () => {
    const todos = [
    { completed: true },
    { completed: false },
    { completed: true },
    { completed: true }
    ];
    const stats = getTodoStats(todos);
    expect(stats).toEqual({
    total: 4,
    completed: 3,
    active: 1,
    completionRate: 75
    });
});

it('повертає нульову статистику для порожнього списку', () => {
    const stats = getTodoStats([]);
    expect(stats).toEqual({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0
    });
});

it('округлює відсоток завершення', () => {
    const todos = [
    { completed: true },
    { completed: false },
    { completed: false }
    ];
    const stats = getTodoStats(todos);
    expect(stats.completionRate).toBe(33);
});
});

describe('createTodo', () => {
it('створює задачу з базовими полями', () => {
    const todo = createTodo('Test task');
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('text', 'Test task');
    expect(todo).toHaveProperty('completed', false);
    expect(todo).toHaveProperty('createdAt');
    expect(todo).toHaveProperty('priority', 'low');
});

it('створює задачу з опціями', () => {
    const todo = createTodo('Test', { 
    priority: 'high', 
    dueDate: '2025-12-31',
    tags: ['work', 'urgent']
    });
    expect(todo.priority).toBe('high');
    expect(todo.dueDate).toBe('2025-12-31');
    expect(todo.tags).toEqual(['work', 'urgent']);
});

it('валідує текст при створенні', () => {
    expect(() => createTodo('')).toThrow();
    expect(() => createTodo('   ')).toThrow();
});

it('обрізає пробіли в тексті', () => {
    const todo = createTodo('  Test  ');
    expect(todo.text).toBe('Test');
});
});