// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import SuperAdminPage from './components/SuperAdminPage';

export default function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Практична робота №9</h1>
        
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
          <Link to="/user" style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            USER
          </Link>
          <Link to="/admin" style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            ADMIN
          </Link>
          <Link to="/superadmin" style={{ padding: '10px 20px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            SUPER ADMIN
          </Link>
        </nav>

        <div style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/user" replace />} />
            
            <Route path="/user" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/superadmin" element={<SuperAdminPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}