import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://127.0.0.1:8000/loans/my-loans", { headers })
      .then((res) => {
        setLoans(res.data.loans || []);
      })
      .catch((err) => console.error("Error fetching user loans:", err))
      .finally(() => setLoading(false));
  }, []);

  
  const getStatusIcon = (status) => {
    
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="text-green-400 w-6 h-6" />;
      case "rejected":
        return <XCircle className="text-red-400 w-6 h-6" />;
      case "completed":
        return <CheckCircle className="text-green-400 w-6 h-6" />;
      default:
        return <Clock className="text-yellow-400 w-6 h-6" />;
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
        My Loans Overview
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-400 text-lg animate-pulse">
          Loading your loans...
        </p>
      ) : loans.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 text-lg"
        >
          You haven't applied for any loans yet.
        </motion.p>
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
              {/* glowing border animation */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-all duration-500"></div>

              {/* Card content */}
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-blue-300">
                    {loan.loan_name || "Scheme Loan"}
                  </h2>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(loan.status)}
                    <span
                      className={`font-semibold capitalize ${
                        loan.status === "Approved"
                          ? "text-green-400"
                          : loan.status === "Rejected"
                          ? "text-red-400"
                          : loan.status === "Completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                </div>

                <div className="text-gray-300 text-sm space-y-1">
                  <p>
                    Amount:{" "}
                    <span className="text-yellow-400 font-semibold">
                      ₹{loan.amount.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Duration:{" "}
                    <span className="text-blue-300 font-semibold">
                      {loan.duration_months} months
                    </span>
                  </p>
                  {loan.interest_rate && (
                    <p>
                      Interest:{" "}
                      <span className="text-green-400 font-semibold">
                        {loan.interest_rate}%
                      </span>
                    </p>
                  )}
                  <p>
                    Type:{" "}
                    <span className="text-gray-400 italic">
                      {loan.type || "Standard"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Applied on:{" "}
                    {new Date(loan.created_at || loan.applied_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                  </p>
                </div>

                {loan.description && (
                  <p className="mt-3 text-gray-400 text-sm italic">
                    “{loan.description}”
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
