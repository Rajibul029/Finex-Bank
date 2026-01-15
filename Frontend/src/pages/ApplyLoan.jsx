import { useState } from "react";
import { applyLoan } from "../api/loanApi";
import { motion } from "framer-motion";

export default function ApplyLoan() {
  const [form, setForm] = useState({ loan_type: "personal", amount: "", tenure_months: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await applyLoan(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to apply loan");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-gradient-to-br from-blue-700/80 to-indigo-700/80 backdrop-blur-lg text-white p-6 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-300">🏦 Apply for Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Loan Type</label>
          <select
            className="w-full bg-white/20 border border-white/30 p-2 rounded text-black"
            value={form.loan_type}
            onChange={(e) => setForm({ ...form, loan_type: e.target.value })}
          >
            <option value="personal">Personal</option>
            <option value="education">Education</option>
            <option value="home">Home</option>
            <option value="vehicle">Vehicle</option>
          </select>
        </div>

        <div>
          <label>Amount (₹)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full bg-white/20 border border-white/30 p-2 rounded text-white"
            required
          />
        </div>

        <div>
          <label>Tenure (Months)</label>
          <input
            type="number"
            value={form.tenure_months}
            onChange={(e) => setForm({ ...form, tenure_months: e.target.value })}
            className="w-full bg-white/20 border border-white/30 p-2 rounded text-white"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-full bg-yellow-300 text-blue-900 font-bold py-2 rounded-full hover:bg-yellow-400 transition"
        >
          Apply Loan
        </motion.button>
      </form>

      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </motion.div>
  );
}
