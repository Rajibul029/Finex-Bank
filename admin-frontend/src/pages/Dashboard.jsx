import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({ accounts: 0, loans: 0, schemes: 0 });
  const [loanStats, setLoanStats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get("http://127.0.0.1:8000/admin/accounts", { headers }),
      axios.get("http://127.0.0.1:8000/admin/loans", { headers }),
      axios.get("http://127.0.0.1:8000/admin/loans/schemes", { headers }),
    ]).then(([a, l, s]) => {
      setStats({
        accounts: a.data.total_accounts,
        loans: l.data.total_loans,
        schemes: s.data.total_schemes,
      });

      // Calculate loan distribution
      const active = l.data.loans.filter((x) => x.status === "approved").length;
      const pending = l.data.loans.filter((x) => x.status === "pending").length;
      const rejected = l.data.loans.filter((x) => x.status === "rejected").length;
      setLoanStats([
        { name: "Approved", value: active },
        { name: "Pending", value: pending },
        { name: "Rejected", value: rejected },
      ]);
    });
  }, []);

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];
  const summaryData = [
    { name: "Accounts", value: stats.accounts },
    { name: "Loans", value: stats.loans },
    { name: "Schemes", value: stats.schemes },
  ];
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-y-auto p-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Dashboard Overview
        </motion.h1>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { title: "Total Accounts", value: stats.accounts, color: "blue", path: "/accounts" },
            { title: "Total Loans", value: stats.loans, color: "green", path: "/loans" },
            { title: "Loan Schemes", value: stats.schemes, color: "purple", path: "/schemes" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleClick(stat.path)}
              className={`bg-${stat.color}-700/30 backdrop-blur-lg border border-${stat.color}-600/40 rounded-2xl p-6 shadow-lg text-center`}
            >
              <h2 className="text-lg text-gray-300">{stat.title}</h2>
              <p className={`text-4xl font-bold mt-2 text-${stat.color}-400`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===== Animated Charts ===== */}
        <div className="grid grid-cols-2 gap-10">
          {/* Chart 1: Loan Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="bg-gray-900 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl mb-4 font-semibold text-orange-300">
              Loan Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {loanStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chart 2: Accounts & Loans Summary */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl mb-4 font-semibold text-blue-400">
              Accounts & Loans Summary
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
