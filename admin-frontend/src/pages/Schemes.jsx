import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState({ name: "", interest_rate: "", max_amount: "" });

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSchemes = async () => {
    const res = await axios.get("http://127.0.0.1:8000/admin/loans/schemes", { headers });
    setSchemes(res.data.loan_schemes);
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/admin/loans/launch", form, { headers });
    setForm({ name: "", interest_rate: "", max_amount: "" });
    fetchSchemes();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
  <Sidebar />
  <div className="flex-1 ml-64 flex flex-col overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Loan Schemes</h1>

        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg mb-8"
        >
          <h2 className="text-xl mb-4">Launch New Scheme</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Scheme Name"
              className="p-3 rounded bg-gray-800 border border-gray-700"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              className="p-3 rounded bg-gray-800 border border-gray-700"
              value={form.interest_rate}
              onChange={(e) => setForm({ ...form, interest_rate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Amount"
              className="p-3 rounded bg-gray-800 border border-gray-700"
              value={form.max_amount}
              onChange={(e) => setForm({ ...form, max_amount: e.target.value })}
            />
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-500 py-2 px-6 rounded transition">
            Launch
          </button>
        </motion.form>

        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg"
        >
          <thead>
            <tr className="bg-gray-800/60 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Interest</th>
              <th className="p-3">Max Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((s) => (
              <motion.tr
                key={s._id}
                whileHover={{ scale: 1.02 }}
                className="border-b border-gray-800"
              >
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.interest_rate}%</td>
                <td className="p-3">₹{s.max_amount}</td>
                <td className="p-3 text-blue-400">{s.status || "active"}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
}
