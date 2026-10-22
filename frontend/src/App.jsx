import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SubmitAsset from './pages/SubmitAsset';
import AssetRegister from './pages/AssetRegister';
import Login from './pages/Login';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Submit Asset</Link>
        <Link to="/register" style={{ marginRight: '1rem', textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Asset Register</Link>
      </div>
      <div>
        {token ? (
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<SubmitAsset />} />
          <Route path="/register" element={<AssetRegister />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;