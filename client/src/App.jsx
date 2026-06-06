import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import StarBackground from './components/StarBackground';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateCapsule from './pages/CreateCapsule';
import Vault from './pages/Vault';
import CapsuleDetail from './pages/CapsuleDetail';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen">
          <StarBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateCapsule />
              </ProtectedRoute>
            } />
            
            <Route path="/vault" element={
              <ProtectedRoute>
                <Vault />
              </ProtectedRoute>
            } />

            <Route path="/capsule/:id" element={<CapsuleDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
