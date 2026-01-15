import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold text-blue-400">🏦 Bank Admin Panel</h1>
      <div className="space-x-6">
        <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
        <Link to="/accounts" className="hover:text-blue-300">Accounts</Link>
        <Link to="/loans" className="hover:text-blue-300">Loans</Link>
        <Link to="/schemes" className="hover:text-blue-300">Schemes</Link>
      </div>
    </nav>
  );
}
