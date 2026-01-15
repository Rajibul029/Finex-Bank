import { useEffect, useState } from "react";
import { getAccountDetails } from "../api/accountApi";
import { motion } from "framer-motion";

export default function AccountDetails() {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const fetchAccount = async () => {
        try {
            const response = await getAccountDetails();
            setAccount(response.data.account_details);
            setError("");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to load account details");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const handleRefresh = async (e) => {

        if (e && e.preventDefault) e.preventDefault();

        setRefreshing(true);

        await fetchAccount();
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl shadow-lg text-center text-gray-600 animate-pulse">
                Loading account details...
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-100 p-6 rounded-2xl shadow-lg text-center text-red-600 font-medium">
                {error}
            </div>
        );
    }

    return (

        <motion.div
            className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 border border-blue-600/40 rounded-2xl p-6 shadow-lg hover:shadow-blue-600/30 transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-300 opacity-10 blur-3xl rounded-full"></div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-extrabold mb-1">Account Summary</h2>
                    <p className="text-sm text-indigo-200">
                        Welcome back, <b>{account?.customer.full_name || "User"}</b>
                    </p>
                </div>

                <motion.button
                    type="button"                             
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRefresh}                   
                    className="bg-white text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold shadow hover:bg-blue-50 transition z-20 pointer-events-auto"
                >
                    {refreshing ? "Refreshing..." : "↻ Refresh"}
                </motion.button>
            </div>

            {/* Account balance card */}
            <motion.div
                className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-5 shadow-inner text-center mt-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <p className="text-lg font-medium text-blue-700 whitespace-normal">Available Balance</p>
                <h1 className="text-4xl font-extrabold mt-1 mb-2 tracking-wide text-blue-900 whitespace-normal">
                    ₹{account.balance.toFixed(2)}
                </h1>
                <p className="text-sm text-blue-900 whitespace-normal">Account No: {account.account_number}</p>
            </motion.div>

            {/* Account info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Account Type</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.account_type || "Savings"}
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Email</p>
                    <p className="text-lg font-semibold text-blue-900 break-words whitespace-normal">
                        {account.customer.email || "Not Available"}
                    </p>
                </motion.div>
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Phone Number</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.customer.phone || "Not Available"}
                    </p>
                </motion.div>
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Address</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.customer.address.street +","+ account.customer.address.city || "Not Available"}
                    </p>
                </motion.div>
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">ID Type</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.customer.id_proof.type || "Not Available"}
                    </p>
                </motion.div>
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">ID Number</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.customer.id_proof.number || "Not Available"}
                    </p>
                </motion.div>
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Nominee</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.customer.nominee.name || "Not Available"}
                    </p>
                </motion.div>
                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Relation</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.customer.nominee.relation || "Not Available"}
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Created On</p>
                    <p className="text-lg font-semibold text-blue-900">
                        {account.created_at
                            ? new Date(account.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : "N/A"}
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white bg-opacity-10 rounded-lg p-3 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                >
                    <p className="text-blue-700 text-sm">Status</p>
                    <p
                        className={`text-lg font-semibold ${account.status ? "text-green-500" : "text-red-300"
                            }`}
                    >
                        {account.status ? "Active" : "Inactive"}
                    </p>
                </motion.div>
                
            </div>
        </motion.div>
);
}
