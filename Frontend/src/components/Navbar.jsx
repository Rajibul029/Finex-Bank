import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ttt2 from '../assets/ttt2.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on the home page
  if (location.pathname === "/") return null;

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Loans", path: "/loans" },
    { name: "My Loans", path: "/my-loans" },
    { name: "Pay EMI", path: "/pay-emi" },
    { name: "Support", path: "/support" },

  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-blue-800/90 to-indigo-700/90 shadow-lg border-b border-blue-600"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img src={ttt2} alt="Finex Bank of India Logo" className="w-40 h-11" />

        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHovered(link.name)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <Link
                to={link.path}
                className={`text-white text-sm font-semibold tracking-wide ${
                  location.pathname === link.path ? "text-yellow-300" : "hover:text-yellow-300"
                } transition`}
              >
                {link.name}
              </Link>

              {/* Animated underline on hover */}
              <AnimatePresence>
                {hovered === link.name && (
                  <motion.span
                    layoutId="underline"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-yellow-300 origin-left"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="bg-yellow-300 text-blue-800 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-yellow-400 transition"
          >
            Logout
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </motion.button>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-gradient-to-b from-blue-800 to-indigo-700 text-white md:hidden border-t border-blue-600 shadow-lg rounded-b-xl"
            >
              <div className="flex flex-col items-center py-4 gap-3">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className={`text-sm font-semibold hover:text-yellow-300 transition ${
                      location.pathname === link.path ? "text-yellow-300" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-yellow-300 text-blue-800 font-semibold px-5 py-2 rounded-full shadow hover:bg-yellow-400 transition mt-3"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
