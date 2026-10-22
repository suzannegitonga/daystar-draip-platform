import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (response.data.status === 'success') {
        // Store the token in the browser
        localStorage.setItem('token', response.data.data.token);
        setMessage('Login successful! Redirecting...');
        
        // Use window.location to force a reload and update the navbar state
        setTimeout(() => {
          window.location.href = '/register';
        }, 1000);
      }
    } catch (error) {
      setMessage('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Staff Login</h2>
      
      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: message.includes('failed') ? '#ffebee' : '#e8f5e9',
          color: message.includes('failed') ? '#c62828' : '#2e7d32',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '1rem', 
            backgroundColor: '#0056b3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}