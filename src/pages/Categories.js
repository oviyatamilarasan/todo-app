import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import './Categories.css';

// Quick-pick options shown when creating / editing a category.
const ICON_OPTIONS = ['👤', '💼', '📚', '🛒', '💪', '🏠', '🎯', '🎨', '💰', '🍔', '✈️', '🎮', '📁', '⭐', '🔥', '💡'];
const COLOR_OPTIONS = ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function Categories() {
  const { categories, addCategory, editCategory, deleteCategory, getCategoryStats } = useApp();

  // 'add' | 'edit' | 'delete' | null
  const [modalMode, setModalMode] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState('');

  // Add / Edit form state
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  // Delete options
  const [deleteAction, setDeleteAction] = useState('move'); // 'move' | 'delete'
  const [moveToId, setMoveToId] = useState('');

  // ---------- Helpers to open each modal ----------
  const openAddModal = () => {
    setName('');
    setIcon(ICON_OPTIONS[0]);
    setColor(COLOR_OPTIONS[0]);
    setError('');
    setModalMode('add');
  };

  const openEditModal = (cat) => {
    setActiveCategory(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setError('');
    setModalMode('edit');
  };

  const openDeleteModal = (cat) => {
    const stats = getCategoryStats(cat.name);
    const otherCategory = categories.find((c) => c.id !== cat.id);
    setActiveCategory(cat);
    setDeleteAction(stats.total > 0 ? 'move' : 'delete');
    setMoveToId(otherCategory ? otherCategory.id : '');
    setError('');
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveCategory(null);
    setError('');
  };

  // ---------- Submit handlers ----------
  const handleAddSubmit = () => {
    const result = addCategory(name, icon, color);
    if (!result.success) {
      setError(result.message);
      return;
    }
    closeModal();
  };

  const handleEditSubmit = () => {
    const result = editCategory(activeCategory.id, { name, icon, color });
    if (!result.success) {
      setError(result.message);
      return;
    }
    closeModal();
  };

  const handleDeleteConfirm = () => {
    const result = deleteCategory(activeCategory.id, {
      action: deleteAction,
      moveToId,
    });
    if (!result.success) {
      setError(result.message);
      return;
    }
    closeModal();
  };

  const activeStats = activeCategory ? getCategoryStats(activeCategory.name) : null;
  const otherCategories = activeCategory
    ? categories.filter((c) => c.id !== activeCategory.id)
    : [];

  return (
    <div className="categories-wrapper">
      <div className="categories">
        <div className="categories-header">
          <h2 className="page-title">🗂️ Categories</h2>
          <button className="add-category-btn" onClick={openAddModal}>
            + Add Category
          </button>
        </div>

        <div className="category-grid">
          {categories.map((cat) => {
            const stats = getCategoryStats(cat.name);
            const percent = stats.total ? (stats.completed / stats.total) * 100 : 0;

            return (
              <div
                className="category-card"
                key={cat.id}
                style={{ borderTop: `4px solid ${cat.color}` }}
              >
                <div className="cat-header">
                  <span className="cat-icon">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <span className="cat-count">{stats.total} tasks</span>
                </div>

                <div className="cat-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%`, background: cat.color }}
                    />
                  </div>
                  <span>
                    {stats.completed}/{stats.total} done
                  </span>
                </div>

                {/* Quick summary: total / completed / pending */}
                <div className="cat-stats-row">
                  <div className="cat-stat">
                    <span className="cat-stat-value">{stats.total}</span>
                    <span className="cat-stat-label">Total</span>
                  </div>
                  <div className="cat-stat">
                    <span className="cat-stat-value" style={{ color: '#10b981' }}>
                      {stats.completed}
                    </span>
                    <span className="cat-stat-label">Completed</span>
                  </div>
                  <div className="cat-stat">
                    <span className="cat-stat-value" style={{ color: '#f59e0b' }}>
                      {stats.pending}
                    </span>
                    <span className="cat-stat-label">Pending</span>
                  </div>
                </div>

                <ul className="cat-tasks">
                  {stats.tasks.length === 0 && <p className="no-tasks">No tasks here!</p>}
                  {stats.tasks.slice(0, 4).map((task, i) => (
                    <li key={i} className={task.done ? 'done' : ''}>
                      <span className="dot" style={{ background: cat.color }}></span>
                      {task.text}
                    </li>
                  ))}
                  {stats.tasks.length > 4 && (
                    <p className="more">+{stats.tasks.length - 4} more tasks</p>
                  )}
                </ul>

                <div className="cat-actions">
                  <button className="cat-edit-btn" onClick={() => openEditModal(cat)}>
                    ✏️ Edit
                  </button>
                  <button className="cat-del-btn" onClick={() => openDeleteModal(cat)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <Modal
          title={modalMode === 'add' ? '✨ Add Category' : '✏️ Edit Category'}
          onClose={closeModal}
        >
          <label className="field-label" htmlFor="cat-name">
            Category Name
          </label>
          <input
            id="cat-name"
            className="modal-input"
            placeholder="e.g. Health, Travel, Finance..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <label className="field-label">Icon</label>
          <div className="icon-grid">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`icon-option ${icon === opt ? 'selected' : ''}`}
                onClick={() => setIcon(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <label className="field-label">Color</label>
          <div className="color-grid">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`color-option ${color === opt ? 'selected' : ''}`}
                style={{ background: opt }}
                onClick={() => setColor(opt)}
                aria-label={opt}
              />
            ))}
            <label className="color-option custom-color" style={{ background: color }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              🎨
            </label>
          </div>

          {/* Live preview */}
          <div className="category-preview" style={{ borderLeft: `4px solid ${color}` }}>
            <span className="cat-icon">{icon}</span>
            <span>{name || 'Category name'}</span>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button className="modal-btn secondary" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="modal-btn primary"
              onClick={modalMode === 'add' ? handleAddSubmit : handleEditSubmit}
            >
              {modalMode === 'add' ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}

      {/* ================= DELETE MODAL ================= */}
      {modalMode === 'delete' && activeCategory && activeStats && (
        <Modal title={`🗑️ Delete "${activeCategory.name}"`} onClose={closeModal}>
          <p className="modal-text">
            Are you sure you want to delete the{' '}
            <strong>
              {activeCategory.icon} {activeCategory.name}
            </strong>{' '}
            category?
          </p>

          {activeStats.total > 0 ? (
            <>
              <p className="modal-text">
                This category currently has <strong>{activeStats.total}</strong> task
                {activeStats.total === 1 ? '' : 's'}. Choose what should happen to{' '}
                {activeStats.total === 1 ? 'it' : 'them'}:
              </p>

              <div className="radio-group">
                <label className={`radio-option ${deleteAction === 'move' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deleteAction"
                    value="move"
                    checked={deleteAction === 'move'}
                    onChange={() => setDeleteAction('move')}
                    disabled={otherCategories.length === 0}
                  />
                  <div>
                    <strong>Move tasks to another category</strong>
                    <p>Keep the tasks, just reassign them.</p>
                  </div>
                </label>

                {deleteAction === 'move' && (
                  <select
                    className="modal-input move-select"
                    value={moveToId}
                    onChange={(e) => setMoveToId(e.target.value)}
                  >
                    {otherCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                )}

                <label className={`radio-option ${deleteAction === 'delete' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deleteAction"
                    value="delete"
                    checked={deleteAction === 'delete'}
                    onChange={() => setDeleteAction('delete')}
                  />
                  <div>
                    <strong>Delete all tasks in this category</strong>
                    <p>This action cannot be undone.</p>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <p className="modal-text">This category has no tasks. It's safe to delete.</p>
          )}

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button className="modal-btn secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="modal-btn danger" onClick={handleDeleteConfirm}>
              Delete Category
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Categories;