import { useState, useEffect, use } from "react";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../api/workouts";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/Nav";
import Header from "../components/Header";
import CreateButton from "../components/CreateButton";
import CreateWorkoutModal from "../components/CreateWorkoutModal";
import Loading from "../components/Loading";
import Popup from "../components/Popup";
import {
  Dumbbell,
  ChevronRight,
  NotepadText,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");

  const [popupMessage, setPopupMessage] = useState(null);

  const [editingWorkout, setEditingWorkout] = useState(null);

  const showPopup = (text, type = "success") => {
    setPopupMessage({ text, type });
  };

  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setWorkoutName(workout.name);
    setWorkoutDate(workout.date.slice(0, 10));
    setWorkoutNotes(workout.notes || "");
    setIsModalOpen(true);
  };

  const clearModal = () => {
    setWorkoutName("");
    setWorkoutDate("");
    setWorkoutNotes("");
    setIsModalOpen(false);
  }

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
      notes: workoutNotes,
    };

    try {
      if (editingWorkout) {
        const res = await updateWorkout(editingWorkout._id, workout);
        if (res.message) {
          showPopup(res.message, "error");
        } else {
          showPopup("Workout updated!", "success");

          setWorkouts((prevWorkouts) =>
            prevWorkouts.map((w) =>
              w._id === editingWorkout._id ? { ...w, ...res } : w
            )
          );
        }
      } else {
        const res = await createWorkout(workout);
        navigate(`/workout/${res._id}`);
      }

      setWorkoutName("");
      setWorkoutDate("");
      setWorkoutNotes("");
      setEditingWorkout(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showPopup("Something went wrong", "error");
    }
  };

  const handleDeleteWorkout = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );
    if (!confirmed) return;

    try {
      const res = deleteWorkout(id);
      if (res.message) {
        showPopup(res.message, "error");
      } else {
        showPopup("Workout deleted!", "success");
        setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w._id !== id));
      }
    } catch (err) {
      console.error(err);
      showPopup("Something went wrong", "error");
    }
  };

  if (loading) return <Loading />;

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
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/workout/${workout._id}`)}
            >
              {/* Top: Title and Chevron */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">
                  {workout.name.toUpperCase()}
                </h2>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              {/* Date */}
              <p className="text-gray-500 text-sm mb-2">
                {new Date(workout.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* Main row: Exercises/Sets + Icons */}
              <div className="flex items-center justify-between text-gray-700 text-sm">
                {/* Left: Exercises/Sets */}
                <div className="flex items-center">
                  <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{workout.exerciseCount} Exercises,</span>
                  <span className="ml-1">{workout.setCount} Sets</span>
                </div>

                {/* Right: Edit/Delete icons */}
                <div className="flex space-x-2">
                  <RefreshCw
                    className="text-green-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(workout);
                    }}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkout(workout._id);
                    }}
                  />
                </div>
              </div>

              {/* Optional: notes below */}
              {workout.notes && (
                <div className="flex items-center text-gray-700 text-sm mt-2">
                  <NotepadText className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{workout.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {popupMessage && (
          <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
        )}

        {/* Bottom Navigation */}
        <BottomNav currPage={"Home"} />
      </div>

      {/* Modal */}
      <CreateWorkoutModal
        isOpen={isModalOpen}
        onClose={() => clearModal()}
        title={editingWorkout ? "Edit Workout" : "Create a New Workout"}
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
            title={editingWorkout ? "Save Changes" : "Create Workout"}
          />
        </form>
      </CreateWorkoutModal>
    </div>
  );
}
