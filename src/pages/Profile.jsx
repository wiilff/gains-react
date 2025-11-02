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
import CreateWorkoutModal from "../components/CreateWorkoutModal";
import Popup from "../components/Popup";

export default function Profile() {
  const { logout, user, updateAccount, deleteAccount } = useAuth();
  const [profileData, setProfileData] = useState([]);

  const navigate = useNavigate();

  const [timeSpentFilter, setTimeSpentFilter] = useState("weekly");
  const [timeSpent, setTimeSpent] = useState([]);

  const [muscleGroupFilter, setMuscleGroupFilter] = useState("weekly");
  const [muscleGroups, setMuscleGroups] = useState([]);

  const [popupMessage, setPopupMessage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openEditModal = () => {
    setUsername(username);
    setEmail(email);
    setPassword("");
    setIsModalOpen(true);
  }


  const showPopup = (text, type = "success") => {
    setPopupMessage({ text, type });
  };


  useEffect(() => {
    const fetchData = async () => {
      const res = await getProfileData();
      setProfileData(res);
      const userData = await getMe();
      setUsername(userData.name);
      setEmail(userData.email);
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

  const updateUser = async (e) => {

    if(e) e.preventDefault();

    const updatedUser = {
      name: username,
      email: email,
      password: password,
    }

    try {
      await updateAccount(updatedUser);

      showPopup("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update user:", err);
      showPopup("Failed to update profile.", "error");
    }
  }

  if (!profileData) return <Loading></Loading>;

  return (
    <div className="min-h-screen pt-16 pb-16 px-7 md:mx-20 lg:mx-50">
      {/* Header */}
      <Header
        title="Profile"
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

      <Me user={{username, email}} />

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
        onClick={(e) => {
          e.stopPropagation();
          openEditModal();
        }}
        Icon={RefreshCw}
      />

      <CoreButton
        title="Delete Account"
        className="w-full mt-4 bg-red-500"
        onClick={() => deleteAccount()}
        Icon={Trash2}
      />

      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}


      {/* Bottom Navigation */}
      <BottomNav currPage={"Profile"} />


      {/* Modal */}
      <CreateWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Edit Profile"}
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:border-blue-500"
          />



          <CoreButton
            className="w-full"
            title={"Save Changes"}
            onClick={updateUser}
          />
        </form>
      </CreateWorkoutModal>
    </div>
  );
}
