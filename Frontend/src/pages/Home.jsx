import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../api/accountApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MessageCircle } from "lucide-react";

const data = [
  { month: "Jan", Account: 2000 },
  { month: "Feb", Account: 2300 },
  { month: "Mar", Account: 2500 },
  { month: "Apr", Account: 2900 },
  { month: "May", Account: 3400 },
  { month: "Jun", Account: 3700 },
  { month: "Jul", Account: 4000 },
  { month: "Aug", Account: 4700 },
  { month: "Sep", Account: 5200 },
  { month: "Oct", Account: 5900 },
];

const reviews = [
  {
    name: "Rajibul Islam",
    comment: "Finex Bank made my savings effortless! The app is smooth and secure.",
    rating: 5,
  },
  {
    name: "Priya Singh",
    comment: "I love how easy it is to transfer funds. Feels like a modern digital bank.",
    rating: 4,
  },
  {
    name: "Bikash Biswas",
    comment: "Customer support and UI are top-notch! Highly recommend Finex Bank.",
    rating: 5,
  },
  {
    name: "Neha Patel",
    comment: "The mobile banking experience is amazing — everything is quick and intuitive.",
    rating: 5,
  },
  {
    name: "Tania Ghosh",
    comment: "Finex Bank offers the best loan rates and an easy approval process. Impressed!",
    rating: 5,
  },
  {
    name: "Simran Kaur",
    comment: "Their customer care actually listens. My issue was resolved within minutes!",
    rating: 5,
  },
  {
    name: "Animesh Das",
    comment: "Secure, fast, and transparent — I finally found a bank I can trust online.",
    rating: 4,
  },
  {
    name: "Sneha Roy",
    comment: "The dashboard graphs help me track my spending. A smart way to manage money.",
    rating: 5,
  },
  {
    name: "Twaha Islam",
    comment: "Finex Bank’s fixed deposit plans are great! Super easy to invest and track returns.",
    rating: 5,
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await loginUser(email, password);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Auto change reviews
  useState(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bg-blue-400 w-64 h-64 rounded-full opacity-20 blur-3xl top-10 left-10"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bg-indigo-500 w-96 h-96 rounded-full opacity-20 blur-3xl bottom-0 right-10"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Section */}
      <motion.div
        className="z-10 text-center px-6 sm:px-12 md:px-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 drop-shadow-lg">
          Welcome to Finex Bank of India <br/><span className="text-indigo-600">• FBI •</span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
          Your trusted partner for smart, secure, and simple banking.
        </p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTerms(true)}
            className="border border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
{/* Terms & Conditions Popup */}
<AnimatePresence>
  {showTerms && (
    <motion.div
      className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl w-96 p-6 text-white max-h-[80vh] overflow-y-auto scrollbar-hide"

        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-400">
          Terms & Conditions
        </h2>

        <div className="space-y-4 text-sm text-white/90 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-blue-200">
            Finex Bank of India (FBI)
            </span>. By accessing our digital banking services, you agree to comply with the terms stated below.
          </p>

          <p>
            You are responsible for maintaining the confidentiality of your login credentials.
            Any transactions performed using your account will be treated as authorized activity.
          </p>

          <p>
            FBI may collect essential information to improve service delivery, prevent
            unauthorized access, and ensure secure financial operations. All data is handled with
            strict confidentiality.
          </p>

          <p>
            Fraudulent behavior, misuse of services, or attempts to compromise system integrity may
            lead to suspension or termination of services.
          </p>

          <p>
            By continuing to use our platform, you provide consent for Finex Bank of India to
            process your information in accordance with regulatory guidelines and internal safety
            protocols.
          </p>

          <p className="text-blue-300 font-semibold mt-4">
            Thank you for choosing Finex Bank of India — committed to secure and transparent digital banking.
          </p>
        </div>

        <button
          onClick={() => setShowTerms(false)}
          className="mt-5 w-full bg-blue-700 textwhite font-bold py-2 rounded-lg hover:bg-blue-400 transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Graph Section */}
      <motion.div
        className="z-10 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg mt-16 p-6 w-11/12 sm:w-3/4 lg:w-1/2"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-blue-700 mb-3 text-center">Our Accounts Growth</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#1E3A8A" />
            <YAxis stroke="#1E3A8A" />
            <Tooltip />
            <Line type="monotone" dataKey="Account" stroke="#3B82F6" strokeWidth={3} dot={true} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
  className="z-10 mt-16 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white rounded-3xl shadow-2xl w-11/12 sm:w-3/4 lg:w-1/2 p-8 text-center backdrop-blur-md"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <h3 className="text-2xl font-semibold mb-5">What Our Customers Say</h3>
  <AnimatePresence mode="wait">
    <motion.div
      key={reviewIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      {/* Avatar */}
      <div className="w-16 h-16 bg-yellow-400 text-blue-900 font-bold flex items-center justify-center rounded-full text-xl shadow-lg mb-3">
        {reviews[reviewIndex].name.charAt(0)}
      </div>

      {/* Stars */}
      <div className="flex justify-center mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: i < reviews[reviewIndex].rating ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={`text-yellow-300 text-lg ${
              i < reviews[reviewIndex].rating ? "" : "opacity-40"
            }`}
          >
            ★
          </motion.span>
        ))}
      </div>

      {/* Comment */}
      <p className="italic text-lg max-w-md">"{reviews[reviewIndex].comment}"</p>
      <p className="mt-3 font-semibold text-yellow-100">
        — {reviews[reviewIndex].name}
      </p>
    </motion.div>
  </AnimatePresence>
</motion.div>

      {/* Floating Chat Icon */}
      <motion.div
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700"
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowChat(!showChat)}
      >
        <MessageCircle size={28} />
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="fixed bottom-20 right-6 bg-white rounded-2xl shadow-lg p-4 w-72 border border-gray-200"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-blue-700 font-semibold mb-2">Finex Assistant</h4>
            <p className="text-sm text-gray-600 mb-2">
              Hi there! How can I assist you today?
            </p>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border rounded-lg p-2 text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <br/>
      <br/>
      <br/>
      {/* Footer */}
      <motion.footer
        className="absolute bottom-4 text-gray-600 text-sm text-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        © {new Date().getFullYear()} Finex Bank. All rights reserved.
      </motion.footer>

      {/* Sign In Popup */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl w-80 sm:w-96 p-6 text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-center mb-4 text-indigo-800">Sign In</h2>
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-white/20 border border-white/30 placeholder-white/70 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/20 border border-white/30 placeholder-white/70 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              {message && (
                <p className="mt-3 text-sm text-center text-blue-200">{message}</p>
              )}
              <button
                onClick={() => setShowLogin(false)}
                className="mt-4 w-full text-sm text-gray-200 hover:text-white transition"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
