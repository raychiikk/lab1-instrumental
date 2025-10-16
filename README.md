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

* **17 passing tests** covering all major functionality
* Tests for utility functions (filtering, sorting, validation)
* Tests for custom React hook
* Mocked localStorage for testing

### Test Breakdown

* **todoUtils.test.js**: 10 tests for utility functions
* **useTodos.test.js**: 7 tests for React custom hook

## Getting Started

```bash
npm install
npm run dev
npm test
```

## Test Coverage

* ✅ Todo creation and validation
* ✅ Filtering and sorting
* ✅ Statistics calculation
* ✅ Local storage operations
* ✅ User interactions
