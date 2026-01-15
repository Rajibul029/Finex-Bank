import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, CreditCard, CheckCircle, FastForward } from "lucide-react";

export default function PayEmi() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchLoans = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("http://127.0.0.1:8000/loans/active", { headers });
      setLoans(res.data.active_loans || []);
    } catch (err) {
      console.error("Error fetching active loans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // ✅ Handle Normal EMI Payment
  const handlePayEmi = async (loanId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    setProcessingId(loanId);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/loans/pay-emi/${loanId}`,
        {},
        { headers }
      );
      setMessage(res.data.message);

      // Update remaining months locally
      setLoans((prev) =>
        prev.map((loan) =>
          loan._id === loanId
            ? { ...loan, remaining_months: loan.remaining_months - 1 }
            : loan
        )
      );
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to process EMI payment.");
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ Handle Advance EMI Payment
  const handlePayAdvance = async (loanId) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    setProcessingId(loanId);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/loans/pay-advance/${loanId}`,
        {},
        { headers }
      );
      setMessage(res.data.message);

      // Update remaining months
      setLoans((prev) =>
        prev.map((loan) =>
          loan._id === loanId
            ? { ...loan, remaining_months: loan.remaining_months - 1 }
            : loan
        )
      );
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to pay advance EMI.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-10 text-center text-blue-400"
      >
        Pay Your EMIs
      </motion.h1>

      {/* Feedback Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 text-green-400 font-semibold"
        >
          {message}
        </motion.div>
      )}

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">
          Loading your active loans...
        </p>
      ) : loans.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No active loans found.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {loans.map((loan, i) => (
            <motion.div
              key={loan._id}
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
                <h2 className="text-xl font-semibold text-blue-300 mb-3">
                  {loan.loan_name || "Loan"}
                </h2>

                <div className="text-gray-300 text-sm space-y-1">
                  <p>
                    Total Amount:{" "}
                    <span className="text-yellow-400 font-semibold">
                      ₹{loan.total_amount.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    EMI Amount:{" "}
                    <span className="text-green-400 font-semibold">
                      ₹{loan.emi_amount.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Remaining Months:{" "}
                    <span className="text-blue-300 font-semibold">
                      {loan.remaining_months}
                    </span>
                  </p>
                  <p className="flex items-center gap-1 text-gray-400">
                    <Calendar size={16} />
                    Next Due:{" "}
                    <span className="text-gray-300 font-semibold">
                      {new Date(loan.next_due_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                    </span>
                  </p>
                </div>

                {/* Pay EMI button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 10px rgba(59,130,246,0.6)",
                  }}
                  disabled={processingId === loan._id}
                  onClick={() => handlePayEmi(loan._id)}
                  className={`mt-6 w-full py-2 rounded-xl font-semibold text-sm shadow-md transition-all ${
                    processingId === loan._id
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {processingId === loan._id ? (
                    <motion.div
                      className="flex justify-center items-center gap-2"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <CreditCard className="w-5 h-5" /> Processing...
                    </motion.div>
                  ) : (
                    <div className="flex justify-center items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Pay EMI
                    </div>
                  )}
                </motion.button>

                {/* ✅ Pay Advance Button (only if remaining months > 1) */}
                {loan.remaining_months > 1 && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 10px rgba(147,51,234,0.6)",
                    }}
                    disabled={processingId === loan._id}
                    onClick={() => handlePayAdvance(loan._id)}
                    className={`mt-3 w-full py-2 rounded-xl font-semibold text-sm shadow-md transition-all ${
                      processingId === loan._id
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-500"
                    }`}
                  >
                    <div className="flex justify-center items-center gap-2">
                      <FastForward className="w-5 h-5" /> Pay Advance
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
