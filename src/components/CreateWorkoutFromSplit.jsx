import { useEffect, useState } from "react";
import CreateWorkoutModal from "./CreateWorkoutModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CoreButton from "./CoreButton";
import { createWorkout } from "../api/workouts";
import { postSplit } from "../api/splits";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

/**
 * Props:
 *  - split: split object (from backend)
 *  - isOpen: boolean
 *  - onClose: () => void
 */
export default function CreateWorkoutFromSplit({ split, isOpen, onClose }) {
    const navigate = useNavigate();

    const [selectedDay, setSelectedDay] = useState("Monday");
    const [workoutName, setWorkoutName] = useState("");
    const [workoutDate, setWorkoutDate] = useState(null);
    const [workoutNotes, setWorkoutNotes] = useState("");

    const filteredExercises =
        (split?.trainingDays || [])
            .find(td => (td.dayOfWeek || "").toLowerCase() === selectedDay.toLowerCase())
            ?.exercises || [];


    useEffect(() => {
        if (!split) return;
        // default to first training day if exists
        const first = (split.trainingDays && split.trainingDays[0])
            ? formatDay(split.trainingDays[0].dayOfWeek)
            : "Monday";

        setSelectedDay(first);
        setWorkoutName(`${split.name} - ${first}`);
        setWorkoutDate(new Date());
        setWorkoutNotes("");

        console.log(split)

    }, [split]);

    function formatDay(dayOfWeek) {
        if (!dayOfWeek) return "Monday";
        const lower = dayOfWeek.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!workoutName.trim()) return;

        const dateObj = workoutDate instanceof Date ? workoutDate : new Date(workoutDate);
        if (!dateObj || isNaN(dateObj.getTime())) {
            setWorkoutDate(new Date());
        }
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        const utcDate = new Date(Date.UTC(year, month, day, 12, 0, 0));

        const payload = {
            name: workoutName,
            date: utcDate.toISOString(),
            notes: workoutNotes || ""
        };

        const exerciseIds = filteredExercises.map(ex => ex.id);

        console.log(exerciseIds);

        try {
            const res = await createWorkout(payload);
            if (res?.id) {

                if(exerciseIds.length > 0) {
                    await postSplit(res.id, exerciseIds);
                }

                onClose?.();
                navigate(`/workout/${res.id}`);
            } else {
                // fallback: close modal and optionally show error elsewhere
                onClose?.();
            }
        } catch (err) {
            console.error("Failed to create workout from split:", err);
            onClose?.();
        }
    };

    if (!split) return null;

    const availableDays = (split.trainingDays || []).map(td => formatDay(td.dayOfWeek));

    return (
        <CreateWorkoutModal
            isOpen={Boolean(isOpen)}
            onClose={onClose}
            title={"Create Workout"}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Day selector stays the same */}
                <div className="flex overflow-x-auto py-2 space-x-2">
                    {availableDays.length === 0
                        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                            <button key={d} type="button" className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedDay === d ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedDay(d)}>{d}</button>
                        ))
                        : availableDays.map(d => (
                            <button key={d} type="button" className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedDay === d ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedDay(d)}>{d}</button>
                        ))
                    }
                </div>

                {/* Updated exercise list section */}
                <div className="border-2 border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium mb-2">{selectedDay}'s Exercises</h3>
                    <div className="overflow-y-auto h-48">
                        <div className="space-y-2">
                            {filteredExercises.map(exercise => (
                                <div
                                    key={exercise.id}
                                    className="bg-gray-50 rounded-lg p-3 flex justify-between items-center"
                                >
                                    <div className="flex items-center">
                                        <Dumbbell className="w-4 h-4 mr-2 text-blue-500" />
                                        <span>{exercise.name}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredExercises.length === 0 && (
                                <p className="text-gray-500 text-center py-2">
                                    No exercises for this day
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Workout name"

                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg w-full p-2 mb-1 focus:outline-none focus:border-blue-500"
                />

                <div className="relative w-full">
                    <DatePicker
                        placeholderText="Date"
                        selected={workoutDate}
                        onChange={(date) => setWorkoutDate(date)}
                        className="border-2 border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:border-blue-500"
                        wrapperClassName="w-full"
                        popperClassName="absolute z-50"
                    />
                </div>

                <textarea
                    placeholder="Notes (Optional)"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
                ></textarea>


                <CoreButton className="w-full" title="Create Workout" type="submit" />
            </form>
        </CreateWorkoutModal>
    );
}