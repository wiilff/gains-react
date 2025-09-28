import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/Nav";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { LineChartComponent } from "../components/charts/LineChartComponent.jsx";
import PersonalRecords from "../components/PersonalRecords.jsx";
import { getExerciseDetails } from "../api/exercises.js";
import { useEffect, useState, useMemo } from "react";

export default function ExeciseDetails() {
  const [loading, setLoading] = useState(true);
  const [exerciseDetails, setExerciseDetails] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExerciseDetails(id);
        setExerciseDetails(data);
      } catch (err) {
        console.error("Failed to fetch exercise details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const volumeData = useMemo(() => {
    return exerciseDetails
      .filter((d) => d.sets.length > 0)
      .map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        volume: d.sets.reduce((sum, s) => sum + s.reps * (s.weight || 1), 0),
      }));
  }, [exerciseDetails]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pt-16 pb-16 px-7 md:mx-20 lg:mx-50">
      {/* Header */}
      <Header
        title={exerciseDetails[0].exerciseName.toUpperCase()}
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

      <LineChartComponent
        data={volumeData}
        xKey="date"
        lines={[{ yKey: "volume", color: "#4F46E5", name: "Volume" }]}
        hideYAxis={true}
      />

      <PersonalRecords exerciseDetails={exerciseDetails} />

      <div className="mt-6 space-y-6">
        {exerciseDetails.map((detail, index) =>
          detail.sets.length > 0 ? (
            <div
              key={index}
              className="bg-gray-300 p-4 rounded-xl shadow-md border border-gray-200"
            >
              {/* Workout Date top-left */}
              <p className="text-gray-500 text-sm font-semibold mb-4 text-left">
                {new Date(detail.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 border-b border-gray-400 pb-1 mb-2 font-semibold text-gray-700">
                <span>#</span>
                <span>Reps</span>
                <span>Weight</span>
              </div>

              {/* Sets */}
              <div className="space-y-1">
                {detail.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-1"
                  >
                    <span>{set.order}</span>
                    <span>{set.reps}</span>
                    <span>{set.weight <= 1 ? "BW" : `${set.weight} kg`} </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p>No data yet</p>
            </div>
          )
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currPage={"Exercises"} />
    </div>
  );
}
