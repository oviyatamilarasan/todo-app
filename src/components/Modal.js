import './Modal.css';

/**
 * Reusable Modal / Dialog component.
 *
 * Renders a dark, blurred overlay with a centered card. Clicking the
 * overlay (outside the card) or the ✕ button closes the modal via
 * the `onClose` callback.
 *
 * Usage:
 *   <Modal title="Add Category" onClose={() => setOpen(false)}>
 *     ...form fields / content...
 *   </Modal>
 */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;