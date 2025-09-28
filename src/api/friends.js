import api from "../api/axios"

export async function sendFriendRequest(receiverEmail) {
  const res = await api.post(`/api/friends/request/${receiverEmail}`);
  return res.data;
}

export async function respondToFriendRequest(requestId, accept) {
  const res = await api.post(`/api/friends/respond/${requestId}?accept=${accept}`);
  return res.data;
}

export async function getAllUsersWithFriendStatus() {
  const res = await api.get("/api/friends/users");
  return res.data;
}
