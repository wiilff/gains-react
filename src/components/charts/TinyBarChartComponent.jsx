import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function TinyBarChart({ data, xKey, yKey, color = "#2563EB" }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-50 mt-2">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ bottom: 30 }}> 
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            angle={-45}            // rotate labels
            textAnchor="end"       // align nicely
            interval={0}           // show every tick
          
          />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey={yKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
