import BottomNav from "../components/Nav";
import Header from "../components/Header";
import { getExerciseStats } from "../api/exercises";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Dumbbell, Search } from "lucide-react";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExerciseStats();
      console.log(data);
      setExercises(data);
    };

    fetchData();
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const searchForExercise = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    const filtered = exercises.filter((exercise) =>
      exercise.exerciseName.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <div className="min-h-screen pt-16 pb-16 px-7">
      {/* Header */}
      <Header
        title="LIGHT WEIGHT BABY"
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

      <div className="bg-blue-50 p-4 rounded-xl shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-4">Search</h2>
        {/* Search */}
        <div className="relative w-full mb-4 mt-4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={searchForExercise}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* EXERCISES */}
      <div className="mt-6 space-y-4">
        {(searchQuery ? searchResults : exercises).map((exercise) => (
          <div
            key={exercise.exerciseId}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/exercise/${exercise.exerciseId}`)}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">
                {exercise.exerciseName.toUpperCase()}
              </h2>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center text-gray-700 text-sm">
              <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
              <span>{exercise.setCount} total sets in {exercise.workoutCount} workouts</span>
            </div>
          </div>
        ))}
      </div>

      <BottomNav currPage={"Exercises"} />
    </div>
  );
}
