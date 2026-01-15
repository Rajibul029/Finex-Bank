import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function LoanDashboard() {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [request, setRequest] = useState(false);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");
  const [customLoan, setCustomLoan] = useState({
    name: "",
    amount: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://127.0.0.1:8000/loans/schemes", { headers })
      .then((res) => setSchemes(res.data.loan_schemes))
      .catch((err) => console.error("Error fetching schemes:", err));
  }, []);

  // 🧩 Submit Loan Application
  const handleApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/loans/apply",
        {
          scheme_id: selectedScheme._id,
          amount: parseFloat(amount),
          duration_months: parseInt(duration),
        },
        { headers }
      );
      setMessage(res.data.message);
      setSelectedScheme(null);
      setAmount("");
      setDuration("");
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "Failed to apply for this loan scheme."
      );
    }
  };

  // 🧠 Custom Loan Application
  const handleCustomApply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/loans/custom-apply",
        {
          name: customLoan.name,
          amount: parseFloat(customLoan.amount),
          duration_months: parseInt(customLoan.duration),
          description: customLoan.description,
        },
        { headers }
      );
      setMessage(res.data.message);
      setCustomLoan({ name: "", amount: "", duration: "", description: "" });
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
        "Failed to submit personalized loan request."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-10 text-center text-blue-400"
      >
        Available Loan Schemes
      </motion.h1>

      {message && (
        <div className="text-center mb-6 text-green-400 font-semibold">
          {message}
        </div>
      )}

      {schemes.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No active loan schemes available.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {schemes.map((scheme, i) => (
            <motion.div
              key={scheme._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 25px rgba(37,99,235,0.4)",
              }}
              className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 border border-blue-600/40 rounded-2xl p-6 shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-all duration-500"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold text-blue-300 mb-3">
                  {scheme.name}
                </h2>

                <div className="space-y-2 text-gray-300 text-sm">
                  <p>
                    Interest Rate:{" "}
                    <span className="font-semibold text-green-400">
                      {scheme.interest_rate}%
                    </span>
                  </p>
                  <p>
                    Max Amount:{" "}
                    <span className="font-semibold text-yellow-400">
                      ₹{scheme.max_amount.toLocaleString()}
                    </span>
                  </p>

                  {scheme.description && (
                    <p className="text-gray-400 italic text-xs mt-1">
                      “{scheme.description}”
                    </p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 10px rgba(59,130,246,0.6)",
                  }}
                  onClick={() => setSelectedScheme(scheme)}
                  className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm shadow-md transition-all"
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 💬 Floating Popup Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-900 border border-blue-600/40 rounded-2xl p-8 w-[400px] shadow-xl"
            >
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Apply for {selectedScheme.name}
              </h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Max ₹${selectedScheme.max_amount.toLocaleString()}`}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mt-1 outline-none border border-gray-700 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 12"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mt-1 outline-none border border-gray-700 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-between gap-4 mt-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-semibold"
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedScheme(null)}
                    type="button"
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💠 Personalized Loan Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-16 bg-gradient-to-br from-blue-800 via-gray-900 to-gray-950 border border-blue-600/40 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          Request for a Personalized Loan
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 10px rgba(59,130,246,0.6)",
          }}
          onClick={() => setRequest(true)}
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm shadow-md transition-all"
        >
          Make a Request
        </motion.button>
        <AnimatePresence>
          {request && (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              onSubmit={handleCustomApply}
              className="mt-6 space-y-4 bg-gray-800 p-6 rounded-2xl"
            >
              <div>
            <label className="text-sm text-gray-400">Loan Name</label>
            <input
              type="text"
              value={customLoan.name}
              onChange={(e) =>
                setCustomLoan({ ...customLoan, name: e.target.value })
              }
              placeholder="e.g. Wedding Loan, Medical Loan"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mt-1 outline-none border border-gray-700 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400">Amount</label>
              <input
                type="number"
                value={customLoan.amount}
                onChange={(e) =>
                  setCustomLoan({ ...customLoan, amount: e.target.value })
                }
                placeholder="Enter amount"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mt-1 outline-none border border-gray-700 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-400">Duration (months)</label>
              <input
                type="number"
                value={customLoan.duration}
                onChange={(e) =>
                  setCustomLoan({ ...customLoan, duration: e.target.value })
                }
                placeholder="e.g. 12"
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mt-1 outline-none border border-gray-700 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={customLoan.description}
              onChange={(e) =>
                setCustomLoan({ ...customLoan, description: e.target.value })
              }
              placeholder="Tell us why you need this loan..."
              rows="3"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mt-1 outline-none border border-gray-700 focus:border-blue-500"
              required
            />
          </div>
              <div className="flex justify-between gap-4 mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-semibold"
                >
                  Submit Request
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRequest(false)} 
                  type="button"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
