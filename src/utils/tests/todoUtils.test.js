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

it('генерує ID у правильному форматі', () => {
    const id = generateId();
    // Перевіряємо, що ID відповідає формату "число-випадковіСимволи"
    // Наприклад: "1678886400000-1a2b3c4d5"
    const idRegex = /^\d+-[a-z0-9]+$/;
    expect(id).toMatch(idRegex);
});
});

// Тестування функції валідації тексту задачі
describe('validateTodoText', () => {
it('приймає валідний текст', () => {
    // Перевіряємо, що нормальний текст проходить валідацію
    const result = validateTodoText('Купити молоко');
    expect(result).toBe('Купити молоко');
});

it('обрізає пробіли на початку та в кінці', () => {
    const result = validateTodoText('  Замітка з пробілами  ');
    expect(result).toBe('Замітка з пробілами');
});

it('викидає помилку для порожнього тексту', () => {
    // Перевіряємо, що порожній текст викликає точну помилку
    expect(() => validateTodoText('')).toThrow('Todo text cannot be empty');
});

it('викидає помилку для тексту, що складається лише з пробілів', () => {
    expect(() => validateTodoText('   ')).toThrow('Todo text cannot be empty');
});

it('викидає помилку для не-рядкового вводу', () => {
    expect(() => validateTodoText(123)).toThrow('Todo text must be a string');
    expect(() => validateTodoText(null)).toThrow('Todo text must be a string');
    expect(() => validateTodoText(undefined)).toThrow('Todo text must be a string');
});

it('коректно обробляє ліміт у 200 символів', () => {
    const validText = 'a'.repeat(200);
    expect(validateTodoText(validText)).toBe(validText);
});

it('викидає помилку для тексту, довшого за 200 символів', () => {
    const invalidText = 'a'.repeat(201);
    expect(() => validateTodoText(invalidText)).toThrow('Todo text is too long (max 200 characters)');
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
    expect(result.every(todo => !todo.completed)).toBe(true);
});

it('повертає тільки виконані задачі', () => {
    // Перевіряємо, що фільтр "completed" повертає тільки виконані задачі
    const result = filterTodos(todos, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
    expect(result.every(todo => todo.completed)).toBe(true);
});

it('коректно обробляє порожній масив', () => {
    expect(filterTodos([], 'all')).toEqual([]);
    expect(filterTodos([], 'active')).toEqual([]);
    expect(filterTodos([], 'completed')).toEqual([]);
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

it('сортує за датою створення (новіші перші)', () => {
    // Перевіряємо сортування за датою (новіші перші)
    const result = sortTodos(todos, 'date');
    expect(result.map(t => t.id)).toEqual(['2', '3', '1']);
});

it('сортує за пріоритетом (high > medium > low)', () => {
    // Перевіряємо сортування за пріоритетом (high > medium > low)
    const result = sortTodos(todos, 'priority');
    expect(result.map(t => t.priority)).toEqual(['high', 'medium', 'low']);
});

it('сортує за алфавітом', () => {
    const result = sortTodos(todos, 'alphabetical');
    expect(result.map(t => t.text)).toEqual(['Mike', 'Oksana', 'Sabrina']);
});
});

// Тестування функції розрахунку статистики
describe('getTodoStats', () => {
it('рахує статистику коректно для змішаного списку', () => {
    // Перевіряємо правильність розрахунку статистики для змішаного списку
    const todos = [
    { completed: true },
    { completed: false },
    { completed: true }
    ];
    const stats = getTodoStats(todos);
    expect(stats.total).toBe(3);       // Загальна кількість
    expect(stats.completed).toBe(2);    // Кількість виконаних
    expect(stats.active).toBe(1);       // Кількість активних
    expect(stats.completionRate).toBe(67); // Округлено від (2/3 * 100)
});

it('коректно округлює completionRate (1/3)', () => {
    const todos = [
    { completed: true },
    { completed: false },
    { completed: false }
    ];
    const stats = getTodoStats(todos);
    expect(stats.completionRate).toBe(33); // Округлено від (1/3 * 100)
});

it('повертає нульову статистику для порожнього списку', () => {
    // Перевіряємо обробку порожнього списку задач
    const stats = getTodoStats([]);
    expect(stats.total).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.active).toBe(0);
    expect(stats.completionRate).toBe(0);
});
});

// Тестування функції створення нової задачі
describe('createTodo', () => {
it('створює задачу з базовими полями', () => {
    // Перевіряємо створення задачі з обов'язковими полями
    const todo = createTodo('Test task');
    
    expect(todo.text).toBe('Test task');        // Текст задачі
    expect(todo.completed).toBe(false);       // Статус "не виконано"
    expect(todo.priority).toBe('low');        // Пріоритет за замовчуванням
    
    expect(todo.id).toEqual(expect.any(String)); // ID присутній і є рядком
    expect(todo.createdAt).toEqual(expect.any(Number)); // createdAt присутній і є числом
});

it('створює задачу з додатковими опціями', () => {
    const options = {
    priority: 'high',
    dueDate: '2025-12-31',
    tags: ['work', 'important']
    };
    const todo = createTodo('High priority task', options);

    expect(todo.priority).toBe('high');
    expect(todo.dueDate).toBe('2025-12-31');
    expect(todo.tags).toEqual(['work', 'important']);
});

it('валідує текст при створенні (кидає точну помилку)', () => {
    // Перевіряємо, що порожній текст викликає помилку валідації
    expect(() => createTodo('')).toThrow('Todo text cannot be empty');
});
});

