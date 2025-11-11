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

export function LineChartComponent({ data, xKey, lines = [], hideYAxis = false, tooltipFormatter }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-80 mt-4">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} reversed />
          <YAxis hide={hideYAxis} />
          {!hideYAxis && <YAxis />}
          <Tooltip
            formatter={
              tooltipFormatter
                ? tooltipFormatter
                : (value) => value
            }
            labelStyle={{ color: "#6B7280" }}
          />
          <Legend />
          {lines.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.yKey}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              name={line.name || line.yKey}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
