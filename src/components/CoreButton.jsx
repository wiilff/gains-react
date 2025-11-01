import { CirclePlus } from "lucide-react";

export default function CoreButton({
  title,
  Icon = CirclePlus,
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition cursor-pointer ${className}`}
    >
      <Icon className="w-5 h-5" />
      {title}
    </button>
  );
}
