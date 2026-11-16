import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SubmitAsset from "./pages/SubmitAsset";
import AssetRegister from "./pages/AssetRegister";
import MyAssets from "./pages/MyAssets";
import ReviewQueue from "./pages/ReviewQueue";
import LeadershipDashboard from "./pages/LeadershipDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitAsset />} />
          <Route path="/register" element={<AssetRegister />} />
          <Route path="/my-assets" element={<MyAssets />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/leadership" element={<LeadershipDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
