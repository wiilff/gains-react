import profilePic from "../assets/ronnie.png";
import { getUserProfile } from "../api/user";
import { useState } from "react";

export default function Me({ user }) {
  if (!user) return null;

  const [profileStats, setProfileStats] = useState({});

  useState(() => {
    const fetchProfileStats = async () => {
      try {
        const stats = await getUserProfile();
        setProfileStats(stats);
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      } 
      
    };
    fetchProfileStats();
  }, []);
  

  return (
    <div className="bg-blue-100 p-4 rounded-xl shadow-md mt-6 w-full max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">{user}</h2>
          <p className="text-gray-500 text-sm">{user}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 text-center mt-2">
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm truncate">Workouts</p>
          <p className="font-semibold text-gray-800">{profileStats.totalWorkouts}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm truncate">Consecutive Weeks</p>
          <p className="font-semibold text-gray-800">{profileStats.consecutiveWeeks}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm truncate">Sets</p>
          <p className="font-semibold text-gray-800">{profileStats.totalSets}</p>
        </div>
      </div>
    </div>
  );
}
