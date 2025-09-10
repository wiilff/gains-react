import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Graph({ exerciseDetails }) {
  // Filter out details with no sets
  const data = exerciseDetails
    .filter((detail) => detail.sets.length > 0)
    .map((detail) => {
      const volume = (() => {
        const v = detail.sets.reduce(
          (sum, s) => sum + s.reps * (s.weight || 1),
          0
        );
        return v % 1 === 0 ? v : Math.round(v * 100) / 100;
      })();

      return {
        date: new Date(detail.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        volume,
      };
    });

  // If there’s no data after filtering, don’t render the chart
  if (data.length === 0) return null;

  return (
    <div className="w-full h-80 mt-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" reversed />
          <YAxis hide />
          <Tooltip />
          <Line
            type="linear"
            dataKey="volume"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
