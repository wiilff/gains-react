import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/Nav";
import Header from "../components/Header";
import Loading from "../components/Loading";
import CreateButton from "../components/CreateButton";
import Popup from "../components/Popup";
import { v4 as uuidv4 } from "uuid";
import { Dumbbell, Eye, Trash2, Search, X } from "lucide-react";
import { getWorkoutDetails } from "../api/workouts";
import {
  postExerciseToWorkout,
  updateExerciseSets,
  deleteExerciseFromWorkout,
  deleteById,
} from "../api/sets";
import { getExercises, createExercise } from "../api/exercises";
import { useEffect, useState } from "react";
import CreateWorkoutModal from "../components/CreateWorkoutModal";

export default function WorkoutDetails() {
  const [workoutDetails, setWorkoutDetails] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

  const [val, setVal] = useState("");

  const [popupMessage, setPopupMessage] = useState(null);

  const showPopup = (text, type = "success") => {
    setPopupMessage({ text, type });
  };

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkoutDetails(id);
        const exercises = await getExercises();
        setAllExercises(exercises);
        setWorkoutDetails(data);
      } catch (err) {
        console.error("Failed to fetch workout details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  }, []);

  const searchForExercise = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 0) {
      setHasSearched(true);
      const filtered = allExercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  const submitExercise = async (e) => {
    e.preventDefault();

    try {
      const res = await createExercise(newExerciseName);

      if (res.message) {
        showPopup(res.message, "error");
      } else {
        setNewExerciseName("");
        setIsModalOpen(false); // close modal immediately
        showPopup("Exercise created successfully!", "success");
      }
    } catch (err) {
      console.log(err);
      showPopup("Something went wrong", "error");
    }
  };

  const submitExerciseToWorkout = async (exerciseId) => {
    try {
      const res = await postExerciseToWorkout({
        workout_id: id,
        exercise_id: exerciseId,
      });
      const updatedWorkout = await getWorkoutDetails(id);
      setWorkoutDetails(updatedWorkout);

      if (res.message) {
        showPopup(res.message, "error");
      } else {
        showPopup("Exercise added!", "success");
      }
    } catch (err) {
      console.error(err);
      showPopup("Something went wrong", "error");
    }
  };

  const handleSetChange = (workoutExerciseId, setIdentifier, field, value) => {
    setWorkoutDetails((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.workoutExerciseId === workoutExerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set) =>
                (set.setId || set.tempId) === setIdentifier
                  ? { ...set, [field]: value }
                  : set
              ),
            }
          : ex
      ),
    }));
  };

  const addSet = (workoutExerciseId) => {
    setWorkoutDetails((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.workoutExerciseId === workoutExerciseId
          ? {
              ...ex,
              sets: [
                ...(ex.sets || []),
                {
                  tempId: uuidv4(),
                  reps: "",
                  weight: "",
                  order: (ex.sets?.length || 0) + 1,
                },
              ],
            }
          : ex
      ),
    }));
  };

  const deleteSet = async (workoutExerciseId, setId, isPersisted) => {
    setWorkoutDetails((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.workoutExerciseId === workoutExerciseId
          ? {
              ...ex,
              sets: ex.sets.filter(
                (set) => (set.setId ?? set.tempId) !== setId
              ),
            }
          : ex
      ),
    }));

    if (isPersisted) {
      try {
        const res = await deleteById(setId);
      } catch (error) {
        console.error("Error saving sets:", error);
      }
    }
  };

  const removeExerciseFromWorkout = async (workoutExerciseId) => {
    try {
      await deleteExerciseFromWorkout(workoutExerciseId);

      const res = await getWorkoutDetails(id); // fetch fresh state
      setWorkoutDetails(res);

      if (res.message) {
        showPopup(res.message, "error");
      } else {
        showPopup("Exercise removed!", "success");
      }
    } catch (err) {
      console.error(err);
      showPopup("Something went wrong", "error");
    }
  };

  const saveExerciseSets = async (workoutExerciseId) => {
    // Find the exercise in state
    const exercise = workoutDetails.exercises.find(
      (ex) => ex.workoutExerciseId === workoutExerciseId
    );

    if (!exercise) {
      console.error("Exercise not found for id:", workoutExerciseId);
      return;
    }

    // Build payload
    const payload = {
      workoutExerciseId: exercise.workoutExerciseId,
      sets: exercise.sets.map((set) => {
        if (isNaN(set.reps) || isNaN(set.weight)) {
          showPopup("Only numbers, please", "error");
          return;
        }
        return {
          ...(set.setId && { setId: set.setId }),
          reps: set.reps,
          weight: set.weight,
          order: set.order,
        };
      }),
    };

    try {
      const res = await updateExerciseSets(payload);
      console.log(res);

      if (res.message) {
        showPopup(res.message, "error");
      } else {
        showPopup("Sets saved!", "success");
      }

      const updatedSets = res.map((s) => ({
        setId: s._id,
        reps: s.reps,
        weight: s.weight,
        order: s.order,
        workoutExerciseId: s.workoutExerciseId,
      }));

      // overwrite exercise sets in state
      setWorkoutDetails((prev) => ({
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.workoutExerciseId === workoutExerciseId
            ? { ...ex, sets: updatedSets }
            : ex
        ),
      }));
    } catch (error) {
      console.error("Error saving sets:", error);
      showPopup("Something went wrong", "error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pt-16 pb-16 px-7 md:mx-20 lg:mx-50">
      {/* Header */}
      <Header
        title={workoutDetails.name.toUpperCase()}
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

      <div className="bg-blue-50 p-4 rounded-xl shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-4">Select exercise</h2>

        {/* Search */}
        <div className="relative w-full mb-4">
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

        <div className="mt-4 space-y-3">
          {searchResults
            // Filter out exercises already in the workout by name
            .filter(
              (exercise) =>
                !workoutDetails.exercises.some(
                  (ex) => ex.name.toLowerCase() === exercise.name.toLowerCase()
                )
            )
            .slice(0, 5)
            .map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md flex items-center justify-between cursor-pointer"
                onClick={() => submitExerciseToWorkout(exercise._id)}
              >
                <div className="flex items-center space-x-3">
                  <Dumbbell className="text-blue-500" />
                  <span className="font-medium">
                    {exercise.name.toUpperCase()}
                  </span>
                </div>
                <Eye className="text-gray-400" />
              </div>
            ))}
        </div>

        {hasSearched && searchResults.length === 0 ? (
          <div>
            <CreateButton
              title="Exercise missing? Add it here"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        ) : null}
      </div>

      {/* Exercises Section */}
      <div className="mt-6 space-y-4">
        {workoutDetails.exercises.map((exercise) => (
          <div
            key={exercise.workoutExerciseId}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center mb-3">
              <h3
                onClick={() => navigate(`/exercise/${exercise.exerciseId}`)}
                className="font-semibold text-lg cursor-pointer"
              >
                {exercise.name.toUpperCase()}
              </h3>

              <Trash2
                className="text-red-500 cursor-pointer"
                onClick={() =>
                  removeExerciseFromWorkout(exercise.workoutExerciseId)
                }
              />
            </div>

            {/* Sets */}
            {exercise.sets?.map((set) => (
              <div
                key={set.setId || set.tempId}
                className="flex gap-2 mb-2 items-center"
              >
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  value={set.reps}
                  placeholder="Reps"
                  onChange={(e) =>
                    handleSetChange(
                      exercise.workoutExerciseId,
                      set.setId || set.tempId,
                      "reps",
                      e.target.value
                    )
                  }
                  className="border p-1 rounded w-20"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  value={set.weight ?? ""}
                  placeholder="Weight"
                  onChange={(e) =>
                    handleSetChange(
                      exercise.workoutExerciseId,
                      set.setId || set.tempId,
                      "weight",
                      e.target.value
                    )
                  }
                  className="border p-1 rounded w-20"
                />
                <X
                  className="text-red-500 cursor-pointer"
                  onClick={() =>
                    deleteSet(
                      exercise.workoutExerciseId,
                      set.setId ?? set.tempId,
                      Boolean(set.setId)
                    )
                  }
                />
              </div>
            ))}

            {/* Option to add a new set + Save Changes button */}
            <div className="mt-4 flex justify-between items-center">
              <button
                className="text-blue-500 font-medium"
                onClick={() => addSet(exercise.workoutExerciseId)}
              >
                + Add Set
              </button>

              <button
                className="text-green-500 font-medium"
                onClick={() => saveExerciseSets(exercise.workoutExerciseId)}
              >
                Save changes
              </button>
            </div>
          </div>
        ))}
      </div>

      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}

      {/*MODAL*/}

      <CreateWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create new exercise"
      >
        <form className="space-y-4" onSubmit={submitExercise}>
          <input
            type="text"
            placeholder="Exercise name"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          />

          <CreateButton className="w-full" title="Create exercise" />
        </form>
      </CreateWorkoutModal>

      {/* Bottom Navigation */}

      <BottomNav currPage={"Home"} />
    </div>
  );
}
