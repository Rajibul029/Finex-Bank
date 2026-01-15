import { useState } from "react";
import { transferMoney } from "../api/accountApi";
import { motion } from "framer-motion";

export default function TransferForm() {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!receiverId || !amount || parseFloat(amount) <= 0) {
      setMsg("Please enter valid transfer details!");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      const res = await transferMoney(receiverId, parseFloat(amount));
      setMsg(res.data.message || "Transfer successful!");
      setReceiverId("");
      setAmount("");
    } catch (err) {
      setMsg(err.response?.data?.detail || "Transfer failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 border border-blue-600/40 rounded-2xl p-6 shadow-lg hover:shadow-blue-600/30 transition-all duration-300 overflow-hidden"
    >
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-300 opacity-10 blur-3xl rounded-full"></div>

      <h2 className="text-2xl font-bold mb-4 text-white text-center tracking-wide drop-shadow-lg">
        Transfer
      </h2>

      <form onSubmit={handleTransfer} className="space-y-4 relative z-10">
        <div>
          <label className="block text-sm text-indigo-200 mb-1 font-semibold">
            Receiver Account ID
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Enter receiver account ID"
            className="w-full bg-white/20 border border-white/30 placeholder-white/70 text-white text-lg rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-indigo-200 mb-1 font-semibold">
            Amount (₹)
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1000"
            className="w-full bg-white/20 border border-white/30 placeholder-white/70 text-white text-lg rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold text-sm shadow-md transition-all"
        >
          {loading ? "Processing..." : "Transfer Now"}
        </motion.button>
      </form>

      {msg && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-4 text-sm text-center font-medium ${
            msg.toLowerCase().includes("success")
              ? "text-green-300"
              : "text-red-300"
          }`}
        >
          {msg}
        </motion.p>
      )}

      {/* Animated Glow Line */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[5px] bg-gradient-to-r from-yellow-300 via-blue-600 to-yellow-300"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />
    </motion.div>
  );
}
