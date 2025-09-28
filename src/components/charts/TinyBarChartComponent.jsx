import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function TinyBarChart({ data, xKey, yKey, color = "#2a5735" }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-40 mt-2">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey={yKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
