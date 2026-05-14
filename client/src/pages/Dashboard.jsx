import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // FETCH TASKS
  useEffect(() => {
  if (token) {
    fetchTasks();
  }
}, [token]);
  const fetchTasks = async () => {
  try {
    console.log("TOKEN:", token);

    const res = await axios.get(
      "http://localhost:5000/api/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("TASK DATA:", res.data);

    setTasks(res.data || []);
  } catch (error) {
    console.log(
      "FETCH ERROR:",
      error.response?.data || error.message
    );

    toast.error("Failed to load tasks");
  }
};

  // ADD TASK
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      toast.success("Task added");
      fetchTasks();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add task");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Task deleted");
      fetchTasks();
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  // TOGGLE TASK
  const toggleTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  // STATS
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.completed
  ).length;

  const pendingTasks = tasks.filter(
    (t) => !t.completed
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // FILTER + SEARCH
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title || "")
  .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "completed") {
      return matchesSearch && task.completed;
    }

    if (filter === "pending") {
      return matchesSearch && !task.completed;
    }

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Task Dashboard
          </h1>

          <p className="text-gray-300 mt-2">
            {pendingTasks} active tasks
          </p>

          {/* PROGRESS */}
          <div className="w-64 bg-white/10 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-white text-lg">
            👋 {user?.name}
          </p>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 p-5 rounded-2xl text-white">
          Total: {totalTasks}
        </div>

        <div className="bg-green-500/20 p-5 rounded-2xl text-green-300">
          Done: {completedTasks}
        </div>

        <div className="bg-yellow-500/20 p-5 rounded-2xl text-yellow-300">
          Pending: {pendingTasks}
        </div>

        <div className="bg-blue-500/20 p-5 rounded-2xl text-blue-300">
          {completionRate}%
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white/10 rounded-3xl p-6 max-w-3xl mx-auto">

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 p-3 rounded-xl bg-slate-900 text-white"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 rounded-xl bg-slate-900 text-white"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* ADD TASK */}
        <div className="flex gap-3 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add task..."
            className="flex-1 p-3 rounded-xl bg-slate-900 text-white"
          />

          <button
            onClick={addTask}
            className="bg-blue-500 px-5 rounded-xl text-white"
          >
            Add
          </button>
        </div>

        {/* EMPTY */}
        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-400">
            No tasks found 🚀
          </p>
        )}

        {/* TASK LIST */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task._id}
              whileHover={{ scale: 1.02 }}
              className={`flex justify-between items-center p-4 rounded-xl ${
                task.completed
                  ? "bg-green-500/10"
                  : "bg-white/10"
              }`}
            >
              <div
                onClick={() => toggleTask(task._id)}
                className="cursor-pointer flex gap-3 items-center"
              >
                <div className="w-4 h-4 border rounded-full flex items-center justify-center">
                  {task.completed && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </div>

                <p
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-white"
                  }
                >
                  {task.title}
                </p>
              </div>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-400"
              >
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;