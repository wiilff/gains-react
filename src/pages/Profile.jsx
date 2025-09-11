import { useAuth } from "../context/AuthContext";
import CreateButton from "../components/CreateButton";
import Header from "../components/Header";
import BottomNav from "../components/Nav"

export default function Profile() {

    const { logout } = useAuth();

  return (
    <div className="min-h-screen pt-16 pb-16 px-7">
      {/* Header */}
      <Header
        title="Profile"
        profileImage="https://i.pravatar.cc/150?img=3" // demo avatar
      />

    <CreateButton
        title="Logout"
        className="w-full mt-4"
        onClick={() => logout()}
    />

    <h1 className="text-2xl text-center mt-10">Work in progress you know</h1>

      {/* Bottom Navigation */}
      <BottomNav currPage={"Profile"} />
    </div>
  );
}
