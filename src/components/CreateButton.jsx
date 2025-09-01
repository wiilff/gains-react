import { CirclePlus } from 'lucide-react';

export default function CreateButton({ title, className = '', onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition ${className}`}
        >
            <CirclePlus className="w-5 h-5"/>
            {title}
        </button>
    )
}