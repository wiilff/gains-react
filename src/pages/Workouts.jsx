import { useState, useEffect, use } from "react";
import { getWorkouts, createWorkout } from "../api/workouts";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/Nav";
import Header from "../components/Header";
import CreateButton from "../components/CreateButton";
import CreateWorkoutModal from "../components/CreateWorkoutModal";
import Loading from "../components/Loading";
import { Dumbbell, ChevronRight, NotepadText } from "lucide-react";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to fetch workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const submitWorkout = async (e) => {
      e.preventDefault();

      const workout = {
        name: workoutName,
        date: workoutDate,
        notes: workoutNotes
      }

      try {
        const res = await createWorkout(workout);
        console.log(res);
        navigate(`/workout/${res._id}`);

      } catch(err) {
        console.error(err);
      }
      
    }

  if (loading) return <Loading/>

  return (
    <div className="min-h-screen pt-16 pb-16">
      {/* Header */}
      <Header
        title="LIGHT WEIGHT BABY"
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

      <div className="px-7 mt-6">
        <CreateButton
          className="w-full"
          title="Create a new workout" 
          onClick={() => setIsModalOpen(true)}
      />

        {/* Page content */}
        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-semibold">Recent workouts</h1>
        </div>

        {/* CARDS */}
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout._id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
              onClick={() => navigate(`/workout/${workout._id}`)}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{workout.name.toUpperCase()}</h2>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <p className="text-gray-500 text-sm">
                {new Date(workout.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>

              <div className="flex items-center text-gray-700 text-sm mt-2">
                <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                <span>{workout.exerciseCount} Exercises,</span>
                <span className="ml-1">{workout.setCount} Sets</span>
              </div>

              {workout.notes && (
                <div className="flex items-center text-gray-700 text-sm mt-2">
                  <NotepadText className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{workout.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          currPage={"Home"} 
        />
      </div>

      {/* Modal */}
      <CreateWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Workout"
      >
        <form className="space-y-4" onSubmit={submitWorkout}>
          <input
            type="text"
            placeholder="Workout name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          />

          <input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Notes (Optional)"
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          ></textarea>
          
          <CreateButton
            className="w-full"
            title="Create workout"
          />
        </form>
      </CreateWorkoutModal>

    </div>
  );
}
