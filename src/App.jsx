import { Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Workouts from "./pages/Workouts";
import WorkoutDetails from "./pages/WorkoutDetails";
import ExeciseDetails from "./pages/ExerciseDetails";
import Execises from "./pages/Exercises";

export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Workouts />} />
        <Route path="/workout/:id" element={<WorkoutDetails />} />
        <Route path="/exercise/:id" element={<ExeciseDetails />} />
        <Route path="/exercise" element={<Execises />} />
      </Routes>
    
  );
}
