// src/components/Modal.jsx
export default function CreateWorkoutModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-6 relative border-2 border-gray-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Modal title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Modal content */}
        {children}
      </div>
    </div>
  );
}
