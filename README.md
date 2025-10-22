# Todo List Application

A modern React Todo List application with comprehensive unit testing.

## Features

* ✅ Add, edit, delete todos
* ✅ Filter by status (all / active / completed)
* ✅ Sort by date, alphabetical order, priority
* ✅ Priority levels (high / medium / low)
* ✅ Statistics and completion rate
* ✅ Local storage persistence
* ✅ Fully responsive design
* ✅ Comprehensive unit tests

## Tech Stack

* React 18
* Vitest (for unit testing)
* CSS3 with modern layout

## Project Structure

```
src/
├── hooks/
│   ├── useTodos.js            # Custom hook for todo management
│   └── tests/
│       └── useTodos.test.js   # Tests for custom hook
├── utils/
│   ├── todoUtils.js           # Utility functions
│   └── tests/
│       └── todoUtils.test.js  # Tests for utilities
└── App.jsx                    # Main component
```

## Testing

The project includes comprehensive unit tests:

* **29 passing tests** covering all major functionality
* In-depth testing for utility functions (filtering, sorting, validation).
* TState and side-effect testing for the custom React hook.
* Mocked localStorage for testing persistence logic.

### Test Breakdown

* **todoUtils.test.js**: 22 tests for utility functions (validation, filtering, sorting, stats).
* **useTodos.test.js**: 7 tests for React custom hook (state logic, localStorage).

## Getting Started

```bash
npm install
npm run dev
npm test
```

## Test Coverage

The test suite covers the following critical and edge-case scenarios:

* ✅ **In-depth validation**: Testing for empty strings, whitespace trimming, string length limits (200 chars), and non-string inputs.

* ✅ **Full filter logic**: Verifies 'all', 'active', 'completed', and empty list scenarios.

* ✅ **All sorting methods**: Verifies sorting by date, priority, and alphabetical order.

* ✅ **Accurate statistics**: Includes total, active, completed, and correct rounding for **completionRate**.

* ✅ **ID Generation**: Ensures generated IDs are unique and match the expected format.

* ✅ **Hook state management**: Ensures **add**, **toggle**, **delete**, and filter state changes work correctly.

* ✅ **Local storage persistence**: Mocks localStorage to verify data is saved and loaded correctly on initialization.