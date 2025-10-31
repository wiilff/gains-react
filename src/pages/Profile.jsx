import { useAuth } from "../context/AuthContext";
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
import CoreButton from "../components/CoreButton";
import { useNavigate } from "react-router-dom";

import { Trash2, RefreshCw } from "lucide-react";

export default function Profile() {
  const { logout, user } = useAuth();
  const [profileData, setProfileData] = useState([]);

  const navigate = useNavigate();

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

      <CoreButton
        title="Your Splits"
        className="w-full mt-4"
        onClick={() => navigate("/splits")}
      />

      {/*  

      <ChartCard
        title="Time Spent in Gym"
        onFilterChange={(filter) => setTimeSpentFilter(filter)}
      >
        <TinyBarChart data={timeSpent} xKey="date" yKey="minutes" />
      </ChartCard>

      */}

      <ChartCard
        title="Muscle Groups worked"
        onFilterChange={(filter) => setMuscleGroupFilter(filter)}
      >
        <TinyBarChart data={muscleGroups} xKey="muscleGroup" yKey="count" />
      </ChartCard>

      {/*  
      <Friends />
      <Feed />
      */}



      <CoreButton
        title="Logout"
        className="w-full mt-4"
        onClick={() => logout()}
      />

      <CoreButton
        title="Edit Profile"
        className="w-full mt-4 bg-yellow-500"
        onClick={() => alert("Change password functionality not implemented yet.")}
        Icon={ RefreshCw }
      />

      <CoreButton
        title="Delete Account"
        className="w-full mt-4 bg-red-500"
        onClick={() => alert("Delete account functionality not implemented yet.")}
        Icon={ Trash2 }
      />


      {/* Bottom Navigation */}
      <BottomNav currPage={"Profile"} />
    </div>
  );
}
