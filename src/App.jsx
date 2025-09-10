import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Summary from "./pages/Summary";
import ReceiptScanner from "./components/extractReceiptWithGoogleVision";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/google" element={<ReceiptScanner />} />
    </Routes>
  );
}

export default App;
