import { useEffect, useState } from "react";
import { getTransactions } from "../api/accountApi";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setTransactions(res.data.transactions);
      setFiltered(res.data.transactions);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);


  useEffect(() => {
    let data = [...transactions];

    if (typeFilter !== "all") {
      data = data.filter((txn) => txn.type.includes(typeFilter));
    }

    if (search.trim() !== "") {
      data = data.filter(
        (txn) =>
          txn.type.toLowerCase().includes(search.toLowerCase()) ||
          txn.amount.toString().includes(search) ||
          (txn.timestamp && txn.timestamp.includes(search))
      );
    }

    setFiltered(data);
  }, [search, typeFilter, transactions]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 border border-blue-600/40 text-white">
          <h2 className="text-2xl font-bold">Transaction History</h2>

          <div className="flex gap-3 mt-3 md:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 rounded text-black focus:outline-none focus:ring focus:ring-blue-200 placeholder:text-amber-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 rounded text-black focus:outline-none"
            >
              <option value="all">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
              <option value="transfer_sent">Transfer Sent</option>
              <option value="transfer_received">Transfer Received</option>
            </select>
            <button
              onClick={fetchTransactions}
              className="bg-blue text-amber-50 font-semibold px-3 py-1 rounded hover:bg-blue-500 transition"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-600 animate-pulse">
            Loading transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-t">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Balance After</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {filtered.map((txn, i) => (
                    <motion.tr
                      key={txn._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.05 }}
                      className={`border-b hover:bg-blue-50 transition ${
                        txn.type.includes("withdraw")
                          ? "text-red-600"
                          : txn.type.includes("deposit")
                          ? "text-green-700"
                          : "text-blue-700"
                      }`}
                    >
                      <td className="px-4 py-3 capitalize font-medium">
                        {txn.type.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{txn.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        ₹{txn.balance_after.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{txn.timestamp}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
