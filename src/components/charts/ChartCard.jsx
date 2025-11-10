// components/ChartCard.jsx
import { useState } from "react";

export default function ChartCard({ title, children, onFilterChange }) {
  const [filter, setFilter] = useState("weekly");

  const handleChange = (newFilter) => {
    setFilter(newFilter);
    if (onFilterChange) onFilterChange(newFilter);
  };

  return (
    <div className="mt-4 bg-white rounded-xl shadow-md p-4 mb-6 text-center">
      {/* Title */}
      <h3 className="text-black font-semibold text-lg mb-3 w-full">{title}</h3>

      {/* Switch */}
      <div className="flex w-full border rounded-full border-blue-600 overflow-hidden mb-4">
        <button
          className={`flex-1 py-1 text-center transition-colors ${
            filter === "weekly" ? "bg-blue-600 font-semibold text-white" : "bg-white font-semibold"
          }`}
          onClick={() => handleChange("weekly")}
        >
          Weekly
        </button>
        <button
          className={`flex-1 py-1 text-center transition-colors border-r-1 border-l-1 border-blue-600 ${
            filter === "monthly" ? "bg-blue-600 font-semibold text-white" : "bg-white font-semibold"
          }`}
          onClick={() => handleChange("monthly")}
        >
          Monthly
        </button>
        <button
          className={`flex-1 py-1 text-center transition-colors ${
            filter === "all-time" ? "bg-blue-600 font-semibold text-white" : "bg-white font-semibold"
          }`}
          onClick={() => handleChange("all-time")}
        >
          All Time
        </button>
      </div>

      {/* Chart */}
      <div className="mt-10">{children}</div>
    </div>
  );
}
