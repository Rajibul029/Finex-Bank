import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/accounts", label: "Accounts", icon: <Users size={20} /> },
  { path: "/loans", label: "Loans", icon: <FileText size={20} /> },
  { path: "/schemes", label: "Schemes", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-b from-slate-900 to-gray-950 w-64 h-screen p-5 text-white fixed shadow-2xl border-r border-gray-800"
    >
      <h2 className="text-2xl font-bold mb-10 text-blue-400">Bank Admin</h2>
      <ul className="space-y-3">
        {menuItems.map(({ path, label, icon }) => (
          <Link key={path} to={path}>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className={`flex items-center p-3 rounded-xl cursor-pointer ${
                pathname === path
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hover:bg-gray-800 hover:text-blue-400"
              }`}
            >
              <span className="mr-3">{icon}</span>
              {label}
            </motion.li>
          </Link>
        ))}
      </ul>
    </motion.div>
  );
}
