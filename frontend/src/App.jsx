import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SubmitAsset from './pages/SubmitAsset';
import AssetRegister from './pages/AssetRegister';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Submit Asset</Link>
        <Link to="/register">Asset Register</Link>
      </nav>
      
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<SubmitAsset />} />
          <Route path="/register" element={<AssetRegister />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;