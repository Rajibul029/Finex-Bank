import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Loans from "./pages/Loans";
import Schemes from "./pages/Schemes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/schemes" element={<Schemes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
