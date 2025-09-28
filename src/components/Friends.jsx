import { useEffect, useState } from "react";
import {
  getAllUsersWithFriendStatus,
  sendFriendRequest,
  respondToFriendRequest,
} from "../api/friends";

export default function FriendSlider() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await getAllUsersWithFriendStatus();
    setUsers(res);
  }

  async function handleAdd(email) {
    await sendFriendRequest(email);
    fetchUsers();
  }

  async function handleRespond(id, accept) {
    await respondToFriendRequest(id, accept);
    fetchUsers();
  }

  function renderAction(user) {
    switch (user.status) {
      case "NONE":
        return (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => handleAdd(user.email)}
          >
            Add
          </button>
        );
      case "PENDING_RECEIVED":
        return (
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleRespond(user.id, true)}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleRespond(user.id, false)}
            >
              Decline
            </button>
          </div>
        );
      case "PENDING_SENT":
        return <span className="text-gray-400">Pending...</span>;
      case "FRIEND":
        return <span className="text-green-600">Friends</span>;
      default:
        return null;
    }
  }

  return (
    <div className="overflow-x-auto flex gap-4 py-4">
      {users.map((user, index) => (
        <div
          key={index}
          className="min-w-[200px] bg-white shadow-md rounded-xl p-4 flex flex-col items-center"
        >
          <img
            src={`https://i.pravatar.cc/100?u=${user.email}`}
            alt={user.name}
            className="w-16 h-16 rounded-full mb-2"
          />
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2">{renderAction(user)}</div>
        </div>
      ))}
    </div>
  );
}
