import profilePic from "../assets/ronnie.png"

export default function Header({ title, profileImage }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-0 shadow-sm z-50">
      <div className="relative flex items-center justify-between px-4 py-3">
        {/* Page title centered */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-800">
          {title}
        </h1>

        {/* Profile picture on the right */}
        <img
          src={profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border ml-auto"
        />
      </div>
    </header>
  );
}