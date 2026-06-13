import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * AppContext
 * -----------
 * Centralized state management for the whole Todo application.
 *
 * Responsibilities:
 *  - Stores and persists the list of Categories (name, icon, color).
 *  - Stores and persists the list of Tasks (linked to categories by name).
 *  - Exposes CRUD helpers for both categories and tasks.
 *  - Keeps tasks <-> categories relationship in sync:
 *      - Renaming a category renames it on every task that uses it.
 *      - Deleting a category lets the caller decide whether to move the
 *        tasks to another category or delete them entirely.
 *
 * Any component can read/update this shared state via the `useApp()` hook,
 * which guarantees automatic re-renders across all pages whenever the
 * underlying data changes (Dashboard, Tasks, Categories, etc.).
 */

const CATEGORY_STORAGE_KEY = 'todoapp_categories';
// Keep the original "tasks" key so existing data from previous versions
// of the app keeps working without any migration step.
const TASK_STORAGE_KEY = 'tasks';

// Default categories created the very first time the app runs.
export const DEFAULT_CATEGORIES = [
  { id: 'cat-personal', name: 'Personal', icon: '👤', color: '#f59e0b' },
  { id: 'cat-work', name: 'Work', icon: '💼', color: '#667eea' },
  { id: 'cat-study', name: 'Study', icon: '📚', color: '#10b981' },
  { id: 'cat-shopping', name: 'Shopping', icon: '🛒', color: '#ef4444' },
  { id: 'cat-fitness', name: 'Fitness', icon: '💪', color: '#8b5cf6' },
];

const AppContext = createContext(null);

function readFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  // ---- State ----
  const [categories, setCategories] = useState(() =>
    readFromStorage(CATEGORY_STORAGE_KEY, DEFAULT_CATEGORIES)
  );
  const [tasks, setTasks] = useState(() => readFromStorage(TASK_STORAGE_KEY, []));

  // ---- Persistence ----
  useEffect(() => {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // =====================================================
  // CATEGORY ACTIONS
  // =====================================================

  /** Add a new category. Returns { success, message } */
  const addCategory = useCallback((name, icon = '🏷️', color = '#667eea') => {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return { success: false, message: 'Category name cannot be empty.' };
    }
    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'A category with this name already exists.' };
    }
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      icon: icon || '🏷️',
      color: color || '#667eea',
    };
    setCategories((prev) => [...prev, newCategory]);
    return { success: true, category: newCategory };
  }, [categories]);

  /** Rename / restyle an existing category and propagate the rename to tasks */
  const editCategory = useCallback((id, updates) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return { success: false, message: 'Category not found.' };

    const newName = (updates.name ?? target.name).trim();
    if (!newName) {
      return { success: false, message: 'Category name cannot be empty.' };
    }

    const duplicate = categories.some(
      (c) => c.id !== id && c.name.toLowerCase() === newName.toLowerCase()
    );
    if (duplicate) {
      return { success: false, message: 'Another category already uses this name.' };
    }

    const oldName = target.name;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: newName,
              icon: updates.icon ?? c.icon,
              color: updates.color ?? c.color,
            }
          : c
      )
    );

    // Keep every task pointing at the right category name after a rename.
    if (oldName !== newName) {
      setTasks((prev) =>
        prev.map((t) => (t.category === oldName ? { ...t, category: newName } : t))
      );
    }

    return { success: true };
  }, [categories]);

  /**
   * Delete a category.
   * options.action: 'move' | 'delete'
   *  - 'move'   -> reassign all tasks of this category to options.moveToId
   *  - 'delete' -> remove all tasks that belong to this category
   */
  const deleteCategory = useCallback((id, options = {}) => {
    const { action = 'delete', moveToId = null } = options;
    const target = categories.find((c) => c.id === id);
    if (!target) return { success: false, message: 'Category not found.' };

    if (categories.length <= 1) {
      return { success: false, message: 'At least one category must remain.' };
    }

    if (action === 'move') {
      const destination = categories.find((c) => c.id === moveToId);
      if (!destination) {
        return { success: false, message: 'Please choose a category to move tasks to.' };
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.category === target.name ? { ...t, category: destination.name } : t
        )
      );
    } else {
      setTasks((prev) => prev.filter((t) => t.category !== target.name));
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  }, [categories]);

  // =====================================================
  // TASK ACTIONS
  // =====================================================

  const addTask = useCallback((task) => {
    setTasks((prev) => [
      ...prev,
      { ...task, done: false, createdAt: new Date().toLocaleDateString() },
    ]);
  }, []);

  const updateTask = useCallback((index, updates) => {
    setTasks((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleTask = useCallback((index) => {
    setTasks((prev) => prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  }, []);

  // =====================================================
  // DERIVED HELPERS
  // =====================================================

  /** Get total / completed / pending counts for a given category name */
  const getCategoryStats = useCallback(
    (categoryName) => {
      const catTasks = tasks.filter((t) => t.category === categoryName);
      const completed = catTasks.filter((t) => t.done).length;
      return {
        total: catTasks.length,
        completed,
        pending: catTasks.length - completed,
        tasks: catTasks,
      };
    },
    [tasks]
  );

  // Default category used when creating a new task. Falls back gracefully
  // if "Personal" was renamed or removed by the user.
  const defaultCategory =
    categories.find((c) => c.name === 'Personal')?.name || categories[0]?.name || '';

  const value = {
    // categories
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    defaultCategory,
    // tasks
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    // helpers
    getCategoryStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Convenience hook for consuming the shared app state */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp() must be used within an <AppProvider>');
  }
  return ctx;
}

export default AppContext;