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
  const data = exerciseDetails.map((detail) => {

    const volume = detail.sets.reduce((sum, s) => sum + s.reps * (s.weight || 1), 0);

    return {
      date: new Date(detail.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volume: volume,
    };
  });

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

  )
}
