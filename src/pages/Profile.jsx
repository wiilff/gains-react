import { useAuth } from "../context/AuthContext";
import CreateButton from "../components/CreateButton";
import Header from "../components/Header";
import Me from "../components/Me";
import BottomNav from "../components/Nav";
import ChartCard from "../components/charts/ChartCard";
import Feed from "../components/Feed";
import { use, useEffect, useState } from "react";
import { getMe, getProfileData } from "../api/profile";
import Loading from "../components/Loading";
import {
  getTimeSpent,
  getMuscleGroupsTrained,
} from "../utils/graphCalculations";
import { TinyBarChart } from "../components/charts/TinyBarChartComponent";
import Friends from "../components/Friends";

export default function Profile() {
  const { logout, user } = useAuth();
  const [profileData, setProfileData] = useState([]);

  const [timeSpentFilter, setTimeSpentFilter] = useState("weekly");
  const [timeSpent, setTimeSpent] = useState([]);

  const [muscleGroupFilter, setMuscleGroupFilter] = useState("weekly");
  const [muscleGroups, setMuscleGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProfileData();
      setProfileData(res);

    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!profileData) return;

    const timeSpentData = getTimeSpent(profileData, timeSpentFilter);
    setTimeSpent(timeSpentData);

    const muscleGroupsWorked = getMuscleGroupsTrained(
      profileData,
      muscleGroupFilter
    );
    setMuscleGroups(muscleGroupsWorked);

  }, [profileData, timeSpentFilter, muscleGroupFilter]);

  if (!profileData) return <Loading></Loading>;

  return (
    <div className="min-h-screen pt-16 pb-16 px-7 md:mx-20 lg:mx-50">
      {/* Header */}
      <Header
        title="Profile"
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

      <Me user={user} />

      {/* Time Spent Chart */}
      <ChartCard
        title="Time Spent in Gym"
        onFilterChange={(filter) => setTimeSpentFilter(filter)}
      >
        <TinyBarChart data={timeSpent} xKey="date" yKey="minutes" />
      </ChartCard>

      {/* Muscle Group Chart */}
      <ChartCard
        title="Muscle Groups worked"
        onFilterChange={(filter) => setMuscleGroupFilter(filter)}
      >
        <TinyBarChart data={muscleGroups} xKey="muscleGroup" yKey="count" />
      </ChartCard>

      <Friends />

      <Feed />

      <CreateButton
        title="Logout"
        className="w-full mt-4"
        onClick={() => logout()}
      />

      {/* Bottom Navigation */}
      <BottomNav currPage={"Profile"} />
    </div>
  );
}
