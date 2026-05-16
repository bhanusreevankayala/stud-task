import { useState } from "react";
import axios from "axios";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleSubmit = async () => {
    try {
      // LOGIN
      if (isLogin) {
        const res = await axios.post(
          "https://stud-task-server.onrender.com/api/auth/login",
          {
            email,
            password,
          }
        );

        console.log(res.data);

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          res.data.token
        );

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        alert("Login successful");

        window.location.reload();
      }

      // REGISTER
      else {
        await axios.post(
          "https://stud-task-server.onrender.com/api/auth/register",
          {
            name,
            email,
            password,
          }
        );

        alert(
          "Registration successful. Please login."
        );

        setIsLogin(true);

        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center mb-8">
          {isLogin
            ? "Welcome Back"
            : "Create Account"}
        </h1>

        <div className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-2xl outline-none"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-2xl outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-2xl outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-semibold transition-all"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="text-center text-gray-300 cursor-pointer hover:text-white transition"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;