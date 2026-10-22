import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SubmitAsset from "./pages/SubmitAsset";
import AssetRegister from "./pages/AssetRegister";
import Login from "./pages/Login";
import Layout from "./components/Layout";

// Simple Route Guard to protect private pages
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/register" element={<AssetRegister />} />
          <Route path="/" element={<SubmitAsset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
