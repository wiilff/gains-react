// src/components/Modal.jsx
export default function CreateWorkoutModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start lg:items-center justify-center z-50 pt-20 lg:pt-0 px-4">
      <div className="
        bg-white rounded-2xl shadow-lg relative border border-gray-300
        w-11/12 max-w-md
        max-h-[90vh] lg:max-h-[95vh]
        p-6 lg:p-8
        overflow-y-auto
      ">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Modal title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Modal content */}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
