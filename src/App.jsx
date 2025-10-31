import { Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Workouts from "./pages/Workouts";
import WorkoutDetails from "./pages/WorkoutDetails";
import ExeciseDetails from "./pages/ExerciseDetails";
import Execises from "./pages/Exercises";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthContext";
import SplitPage from "./pages/SplitPage";

export default function App() {
  return (
      <Routes>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />

        <Route
          path="/workout/:id"
          element={
            <PrivateRoute>
              <WorkoutDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/exercise/:id"
          element={
            <PrivateRoute>
              <ExeciseDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/exercise"
          element={
            <PrivateRoute>
              <Execises />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/splits"
          element={
            <PrivateRoute>
              <SplitPage />
            </PrivateRoute>
          }
        />

      </Routes>
  
  );
}
