import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Code } from "lucide-react";

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10 flex flex-col items-center">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10 text-blue-400 text-center"
      >
        Contact Information
      </motion.h1>

      {/* Bank Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="bg-gradient-to-br from-blue-800 via-blue-900 to-gray-900 border border-blue-600/40 rounded-2xl shadow-lg p-8 w-full max-w-3xl mb-12"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 width-full">
        Finex Bank of India <br/>• FBI •
        </h2>
        <div className="text-gray-300 space-y-3">
          <p className="flex items-center gap-2">
            <MapPin className="text-blue-400" /> <span>Location:</span>{" "}
            <span className="font-medium text-gray-100">Barasat, West Bengal, India</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="text-green-400" /> <span>Customer Care:</span>{" "}
            <span className="font-medium text-gray-100">+91 62963 69214</span>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="text-yellow-400" /> <span>Email:</span>{" "}
            <span className="font-medium text-gray-100">support@finexbank.com</span>
          </p>
        </div>
      </motion.div>

      {/* Developer Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="bg-gradient-to-br from-gray-900 via-blue-800 to-blue-900 border border-blue-600/40 rounded-2xl shadow-lg p-8 w-full max-w-3xl text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Code size={40} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-blue-300 mb-2">
          Developer
        </h2>
        <p className="text-gray-300 mb-1">Developed & Designed by</p>
        <p className="text-blue-400 text-lg font-bold">Team Legend</p>
        <p className="text-sm text-gray-400">B.Tech in Computer Science Engineering</p>
        <p className="text-sm text-gray-400">Brainware University, Kolkata</p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl shadow-md font-semibold text-white"
        >
          <a href="mailto:rajibulislam62963@gmail.com">Contact Developer</a>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-sm mt-16 text-center"
      >
        © {new Date().getFullYear()} Finex Bank | Designed with ❤️ by Team Legend
      </motion.footer>
    </div>
  );
}
