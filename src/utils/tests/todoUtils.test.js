import { describe, it, expect } from 'vitest';
import {
generateId,
validateTodoText,
filterTodos,
sortTodos,
getTodoStats,
createTodo
} from '../todoUtils';

// Тестування функції генерації унікальних ID
describe('generateId', () => {
it('генерує унікальний ID', () => {
    // Перевіряємо, що кожен виклик генерує унікальний ID
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
});
});

// Тестування функції валідації тексту задачі
describe('validateTodoText', () => {
it('приймає валідний текст', () => {
    // Перевіряємо, що нормальний текст проходить валідацію
    const result = validateTodoText('Купити молоко');
    expect(result).toBe('Купити молоко');
});

it('викидає помилку для порожнього тексту', () => {
    // Перевіряємо, що порожній текст викликає помилку
    expect(() => validateTodoText('')).toThrow('Todo text cannot be empty');
});
});

// Тестування функції фільтрації задач
describe('filterTodos', () => {
  // Тестовий набір задач з різними статусами
const todos = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true },
    { id: '3', text: 'Task 3', completed: false }
];

it('повертає всі задачі для фільтру "all"', () => {
    // Перевіряємо, що фільтр "all" повертає всі задачі
    const result = filterTodos(todos, 'all');
    expect(result).toHaveLength(3);
});

it('повертає тільки активні задачі', () => {
    // Перевіряємо, що фільтр "active" повертає тільки невиконані задачі
    const result = filterTodos(todos, 'active');
    expect(result).toHaveLength(2);
});
});

// Тестування функції сортування задач
describe('sortTodos', () => {
  // Тестовий набір задач з різними датами та пріоритетами
const todos = [
    { id: '1', text: 'Sabrina', createdAt: 1000, priority: 'low' },
    { id: '2', text: 'Oksana', createdAt: 3000, priority: 'high' },
    { id: '3', text: 'Mike', createdAt: 2000, priority: 'medium' }
];

it('сортує за датою створення', () => {
    // Перевіряємо сортування за датою (новіші перші)
    const result = sortTodos(todos, 'date');
    expect(result[0].id).toBe('2'); // Задача з найновішою датою має бути першою
});

it('сортує за пріоритетом', () => {
    // Перевіряємо сортування за пріоритетом (high > medium > low)
    const result = sortTodos(todos, 'priority');
    expect(result[0].priority).toBe('high'); // Задача з найвищим пріоритетом має бути першою
});
});

// Тестування функції розрахунку статистики
describe('getTodoStats', () => {
it('рахує статистику коректно', () => {
    // Перевіряємо правильність розрахунку статистики для змішаного списку
    const todos = [
    { completed: true },
    { completed: false },
    { completed: true }
    ];
    const stats = getTodoStats(todos);
    expect(stats.total).toBe(3);     // Загальна кількість
    expect(stats.completed).toBe(2); // Кількість виконаних
});

it('повертає нульову статистику для порожнього списку', () => {
    // Перевіряємо обробку порожнього списку задач
    const stats = getTodoStats([]);
    expect(stats.total).toBe(0); // Повинно бути 0 задач
});
});

// Тестування функції створення нової задачі
describe('createTodo', () => {
it('створює задачу з базовими полями', () => {
    // Перевіряємо створення задачі з обов'язковими полями
    const todo = createTodo('Test task');
    expect(todo.text).toBe('Test task');      // Текст задачі
    expect(todo.completed).toBe(false);       // Статус "не виконано"
    expect(todo.priority).toBe('low');        // Пріоритет за замовчуванням
});

it('валідує текст при створенні', () => {
    // Перевіряємо, що порожній текст викликає помилку валідації
    expect(() => createTodo('')).toThrow();
});
});