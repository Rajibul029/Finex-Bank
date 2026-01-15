import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
  full_name: "",
  dob: "",
  gender: "",
  email: "",
  password: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  },
  id_proof: {
    type: "",
    number: ""
  },
  nominee: {
    name: "",
    relation: "",
    phone: ""
  },
  account_type: "savings",
  initial_deposit: 0
});

  // 🔹 Fetch all accounts
  const fetchAccounts = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get("http://127.0.0.1:8000/admin/accounts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAccounts(res.data.accounts);
  };

  const handleCreateAccount = async () => {
  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const payload = {
  account_type: formData.account_type,
  initial_deposit: formData.initial_deposit,
  customer: {
    full_name: formData.full_name,
    dob: formData.dob,
    gender: formData.gender,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    address: formData.address,
    id_proof: formData.id_proof,
    nominee: formData.nominee,
  },
};


  try {
    await axios.post("http://127.0.0.1:8000/admin/create", payload, { headers });
    setShowAddForm(false);
    fetchAccounts();
  } catch (err) {
    console.error(err);
    alert("Failed to create account");
  }
};

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 🔹 Toggle Account Status
  const handleToggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (currentStatus === "active") {
        await axios.put(`http://127.0.0.1:8000/admin/block/${id}`, {}, { headers });
      } else {
        await axios.put(`http://127.0.0.1:8000/admin/unblock/${id}`, {}, { headers });
      }
      fetchAccounts(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Account Management</h1>

        {/* Add Account Button */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 px-5 py-2 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Add Account
          </motion.button>
        </div>
        {showAddForm && (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      initial={{ scale: 0.75, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.75, opacity: 0, y: 40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-[450px] max-h-[85vh] overflow-y-auto bg-gray-900/40 border border-white/20 shadow-2xl 
                 backdrop-blur-2xl rounded-3xl p-6 text-white scrollbar-hide"
    >
      <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">
        Create New Account
      </h2>

      <div className="space-y-3">

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="glass-input"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
        />

        {/* DOB */}
        <input
          type="date"
          className="glass-input"
          value={formData.dob}
          onChange={(e) =>
            setFormData({ ...formData, dob: e.target.value })
          }
        />

        {/* Gender */}
        <select
          className="glass-input bg-gray-800"
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="glass-input"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="glass-input"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone"
          className="glass-input"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />

        {/* Address Section */}
        <h3 className="text-blue-300 font-semibold mt-4">Address</h3>

        <input
          type="text"
          placeholder="Street"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, street: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="City"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, city: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="State"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, state: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="ZIP Code"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, zip: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="Country"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, country: e.target.value },
            })
          }
        />

        {/* ID Proof */}
        <h3 className="text-blue-300 font-semibold mt-4">ID Proof</h3>

        <input
          type="text"
          placeholder="ID Type (Aadhar / PAN)"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              id_proof: { ...formData.id_proof, type: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="ID Number"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              id_proof: { ...formData.id_proof, number: e.target.value },
            })
          }
        />

        {/* Nominee */}
        <h3 className="text-blue-300 font-semibold mt-4">Nominee</h3>

        <input
          type="text"
          placeholder="Nominee Name"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              nominee: { ...formData.nominee, name: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="Relation"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              nominee: { ...formData.nominee, relation: e.target.value },
            })
          }
        />

        <input
          type="text"
          placeholder="Nominee Phone"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              nominee: { ...formData.nominee, phone: e.target.value },
            })
          }
        />

        {/* Account Details */}
        <h3 className="text-blue-300 font-semibold mt-4">Account Info</h3>

        <select
          className="glass-input"
          value={formData.account_type}
          onChange={(e) =>
            setFormData({ ...formData, account_type: e.target.value })
          }
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
          <option value="fixed">Fixed Deposit</option>
        </select>

        <input
          type="number"
          placeholder="Initial Deposit"
          className="glass-input"
          onChange={(e) =>
            setFormData({
              ...formData,
              initial_deposit: parseFloat(e.target.value),
            })
          }
        />

      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 bg-red-600/70 hover:bg-red-600 rounded-xl transition shadow-md"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </button>

        <button
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
          onClick={handleCreateAccount}
        >
          Create
        </button>
      </div>

    </motion.div>
  </motion.div>
)}



        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-800"
        >
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-800/60">
                <th className="p-4">Account No</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {accounts.map((acc, i) => (
                <motion.tr
                  key={acc._id}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-900/40" : "bg-gray-800/20"
                    } transition-all duration-300`}
                >
                  <td className="p-4">{acc.account_number || "—"}</td>
                  <td className="p-4 font-medium">{acc.customer.full_name || "N/A"}</td>
                  <td className="p-4 text-gray-400">{acc.customer.email || "—"}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${acc.status === "active"
                          ? "bg-green-600/30 text-green-400 border border-green-500/40"
                          : "bg-red-600/30 text-red-400 border border-red-500/40"
                        }`}
                    >
                      {acc.status || "unknown"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleStatus(acc._id, acc.status)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${acc.status === "active"
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-green-600 hover:bg-green-500 text-white"
                        }`}
                    >
                      {acc.status === "active" ? "Deactivate" : "Activate"}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
