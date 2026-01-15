import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LoanDashboard from "./pages/LoanDashboard";
import TransactionHistory from "./components/TransactionHistory";

import ApplyLoan from "./pages/ApplyLoan";
import MyLoans from "./pages/MyLoans";
import PayEMI from "./pages/PayEMI";
import Support from "./pages/Support";

import Home from "./pages/Home";
// in App.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};





function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Banking routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/transactions" element={<TransactionHistory />} />

        {/* Loans routes */}
        <Route path="/loans" element={<LoanDashboard />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
          <Route path="/my-loans" element={<MyLoans />} />
          <Route path="/pay-emi" element={<PayEMI />} />
          <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
