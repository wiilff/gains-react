import { useEffect, useState } from "react";
import { getFeed, createPost } from "../api/profile";
import { getWorkouts } from "../api/workouts";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchWorkouts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await getFeed();
      setFeed(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWorkouts() {
    setLoading(true);
    try {
      const res = await getWorkouts();
      setWorkouts(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!content.trim()) return;

    const post = {
        content: content,
        workoutId: selectedWorkout
    }

    try {
      await createPost(post);
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto py-6 flex flex-col gap-4">
      {/* Create Post */}
      <form
        onSubmit={handlePost}
        className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3"
      >
        <textarea
          className="border rounded p-2 w-full"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          value={selectedWorkout}
          onChange={(e) =>
            setSelectedWorkout(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="w-full p-2 border rounded"
        >
          <option value="">No workout</option>
          {workouts.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </form>

      {feed.length === 0 && <p className="text-gray-500">Feed is empty</p>}
      {feed.map((post, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-4 mb-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <img
              src={`https://i.pravatar.cc/40?u=${post.authorEmail}`}
              alt={post.authorName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{post.authorName}</h3>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mt-2">{post.content}</p>
          {post.workoutId && (
            <div className="mt-2 text-sm text-blue-600">
              <p
                onClick={() => navigate(`/workout/${post.workoutId}`)}
              >
                {post.workoutName}
            
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
