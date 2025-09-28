// components/ChartCard.jsx
import { useState } from "react";

export default function ChartCard({ title, children, onFilterChange }) {
  const [filter, setFilter] = useState("weekly");

  const handleChange = (newFilter) => {
    setFilter(newFilter);
    if (onFilterChange) onFilterChange(newFilter);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 text-center">
      {/* Title */}
      <h3 className="text-gray-700 font-semibold text-lg mb-3 w-full">{title}</h3>

      {/* Switch */}
      <div className="flex w-full border rounded-full overflow-hidden mb-4">
        <button
          className={`flex-1 py-1 text-center transition-colors ${
            filter === "weekly" ? "bg-gray-200 text-black" : "bg-white"
          }`}
          onClick={() => handleChange("weekly")}
        >
          Weekly
        </button>
        <button
          className={`flex-1 py-1 text-center transition-colors ${
            filter === "monthly" ? "bg-gray-200 text-black" : "bg-white"
          }`}
          onClick={() => handleChange("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Chart */}
      <div>{children}</div>
    </div>
  );
}
