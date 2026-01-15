import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/admin/auth/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 to-gray-800 text-white">
      <motion.div
        className="p-8 rounded-2xl shadow-2xl bg-gray-900 w-96"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500">
            Login
          </button>
        </form>
        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
      </motion.div>
    </div>
  );
}
