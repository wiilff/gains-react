import profilePic from "../assets/ronnie.png";

export default function Me({ user }) {
  if (!user) return null;

  return (
    <div className="profile-container p-6 bg-gray-400 rounded-lg shadow-md mb-4 mt-4">
      {/* My Profile Header */}
      <div className="profile-header mb-4 flex items-center space-x-4">
        <div className="avatar w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-full object-cover border ml-auto"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user}</h2>
          <p className="text-gray-500">{user}</p>
        </div>
      </div>
    </div>
  );
}
