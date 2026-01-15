import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Loans() {
  const [loans, setLoans] = useState([]);

  const fetchLoans = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://127.0.0.1:8000/admin/loans", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoans(res.data.loans);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleLoanAction = async (loanId, action) => {
  const token = localStorage.getItem("adminToken");
  const url = `http://127.0.0.1:8000/admin/loans/${action}/${loanId}`;

  try {
    const res = await axios.put(url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert(res.data.message);
    // Optionally refresh loan list
    fetchLoans();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.detail || "Action failed");
  }
};

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
  <Sidebar />
  <div className="flex-1 ml-64 flex flex-col overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Loan Management</h1>

        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-gray-900/80 rounded-xl shadow-lg border border-gray-800"
        >
          <thead>
            <tr className="bg-gray-800/60 text-left">
              <th className="p-3">Loan ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((l) => (
              <motion.tr
                key={l._id}
                whileHover={{ scale: 1.02 }}
                className="border-b border-gray-800"
              >
                <td className="p-3">{l._id}</td>
                <td className="p-3">{l.loan_name || l.scheme_name}</td>
                <td className="p-3">{l.status}</td>
                <td className="p-3">
                  {l.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleLoanAction(l._id, "approve")}
                        className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded mr-2 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleLoanAction(l._id, "reject")}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
}
