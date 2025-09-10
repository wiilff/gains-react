// Popup.jsx
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function Popup({ message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message?.text) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = message.type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div
      className={`fixed top-30 right-4 transform transition-transform duration-500 ease-in-out z-50 ${
        visible ? "translate-x-0" : "translate-x-full"
      } ${bgColor} text-white px-4 py-2 rounded shadow-lg flex items-center gap-2`}
    >
      {message.type === "error" ? <XCircle /> : <CheckCircle />}
      <span>{message.text}</span>
    </div>
  );
}

