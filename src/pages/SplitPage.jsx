import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/Nav";
import CoreButton from "../components/CoreButton";
import ExerciseSelector from "../components/ExerciseSelector";
import CreateWorkoutFromSplit from "../components/CreateWorkoutFromSplit";
import { getSplits, createSplit, updateSplit, deleteSplit } from "../api/splits";
import { getExercises } from "../api/exercises";
import { ChevronRight, Dumbbell, RefreshCw, Trash2, Calendar } from "lucide-react";
import CreateWorkoutModal from "../components/CreateWorkoutModal";

export default function SplitPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [splits, setSplits] = useState([]);
    const [allExercises, setAllExercises] = useState([]);

    const [editingSplit, setEditingSplit] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [splitName, setSplitName] = useState("");
    const [splitDescription, setSplitDescription] = useState("");

    const [validationError, setValidationError] = useState("");

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [selectedDay, setSelectedDay] = useState("Monday");

    const [splitExercises, setSplitExercises] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });

    const [selectedSplitForCreate, setSelectedSplitForCreate] = useState(null);

    useEffect(() => {
        const fetchSplits = async () => {
            const data = await getSplits();
            setSplits(data);
        };

        const fetchExercises = async () => {
            const data = await getExercises();
            setAllExercises(data);
        };

        fetchSplits();
        fetchExercises();

    }, []);

    const handleEditSplit = (split) => {
        setEditingSplit(split);
        setSplitName(split.name);
        setSplitDescription(split.description || "");

        // Convert the trainingDays array into our splitExercises format
        const exercisesByDay = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };

        split.trainingDays.forEach(day => {
            exercisesByDay[day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()] = day.exercises;
        });

        setSplitExercises(exercisesByDay);
        setIsModalOpen(true);
    };

    const handleDeleteSplit = async (splitId) => {
        try {
            await deleteSplit(splitId);
            setSplits(prev => prev.filter(s => s.id !== splitId));
        } catch (error) {
            console.error("Error deleting split:", error);
        }
    }

    const clearModal = () => {
        setSelectedExercises([]);
        setSplitName("");
        setSplitDescription("");
        setValidationError("");
        setEditingSplit(null);
        setSplitExercises({
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        });
        setIsModalOpen(false);
    };


    const handleAddExercise = (exercise) => {
        setSplitExercises(prev => ({
            ...prev,
            [selectedDay]: [...prev[selectedDay], exercise]
        }));
    };

    const handleRemoveExercise = (exerciseId) => {
        setSplitExercises(prev => ({
            ...prev,
            [selectedDay]: prev[selectedDay].filter(ex => ex.id !== exerciseId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setValidationError("");

        if (!splitName.trim()) {
            setValidationError("Split name is required.");
            return;
        }

        const splitData = {
            name: splitName,
            description: splitDescription,
            weeklyExercises: [
                {
                    exercises: splitExercises
                }
            ]
        };

        try {
            if (editingSplit) {
                await updateSplit(editingSplit.id, splitData);
            } else {
                await createSplit(splitData);
            }
            const updatedSplits = await getSplits();
            setSplits(updatedSplits);
        } catch (error) {
            console.error("Error saving split:", error);
            setValidationError("Failed to save split");
            return;
        }

        clearModal();
    };

    return (
        <div className="min-h-screen pt-16 pb-16">
            {/* Header */}
            <Header
                title="LIGHT WEIGHT BABY"
                profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
            />

            <div className="px-7 mt-6 md:mx-20 lg:mx-50">
                <CoreButton
                    className="w-full"
                    title="Create a new split"
                    onClick={() => setIsModalOpen(true)}
                />

                {/* Page content */}
                <div className="mt-6 mb-6">
                    <h1 className="text-2xl font-semibold">Your splits</h1>
                </div>


                <div className="space-y-4">
                    {splits.length === 0 ? (
                        <p className="text-gray-500">No splits found. Create one to get started!</p>
                    ) : (
                        splits.map((split) => {
                            // Calculate total exercises across all training days
                            const totalExercises = split.trainingDays.reduce((total, day) =>
                                total + day.exercises.length, 0
                            );

                            // Get number of training days
                            const trainingDaysCount = split.trainingDays.length;

                            return (
                                <div
                                    key={split.id}
                                    className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
                                    onClick={() => setSelectedSplitForCreate(split)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-lg font-semibold">
                                            {split.name.toUpperCase()}
                                        </h2>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div className="flex items-center justify-between text-gray-700 text-sm">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                                                <span>{totalExercises} Exercises/Week</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                <span>{trainingDaysCount} Days/Week</span>
                                            </div>
                                        </div>

                                        {/* Right: Edit/Delete icons */}
                                        <div className="flex space-x-2">
                                            <RefreshCw
                                                className="text-green-600 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditSplit(split);
                                                }}
                                            />
                                            <Trash2
                                                className="text-red-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSplit(split.id)
                                                }}
                                            />
                                        </div>
                                    </div>


                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav currPage={"Profile"} />


            {/* Modal */}
            <CreateWorkoutModal
                isOpen={isModalOpen}
                onClose={() => clearModal()}
                title={editingSplit ? "Edit Split" : "Create a New Split"}
            >
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Split name"
                        value={splitName}
                        onChange={(e) => {
                            setSplitName(e.target.value);
                            setValidationError("");
                        }}
                        className={`border-2 ${validationError ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg w-full p-2 mb-1 focus:outline-none focus:border-blue-500`}
                    />

                    <textarea
                        placeholder="Description (Optional)"
                        value={splitDescription}
                        onChange={(e) => setSplitDescription(e.target.value)}
                        className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
                    ></textarea>

                    {/* Day selector */}
                    <div className="flex overflow-x-auto py-2 space-x-2">
                        {daysOfWeek.map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
                                ${selectedDay === day
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Exercise selector for current day */}
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium mb-2">{selectedDay}'s Exercises</h3>
                        <ExerciseSelector
                            exercises={allExercises}
                            selectedExercises={splitExercises[selectedDay]}
                            onAdd={handleAddExercise}
                            onRemove={handleRemoveExercise}
                        />
                    </div>


                    <CoreButton
                        className="w-full"
                        title={editingSplit ? "Save Changes" : "Create Split"}
                        type="submit"
                    />
                </form>
            </CreateWorkoutModal>

            <CreateWorkoutFromSplit
                split={selectedSplitForCreate}
                isOpen={Boolean(selectedSplitForCreate)}
                onClose={() => setSelectedSplitForCreate(null)}
            />

        </div>
    );
}
