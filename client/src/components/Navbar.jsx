import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-futuristic-blue">
          TimeNext
        </Link>
        
        <div className="space-x-6 flex items-center">
          {user ? (
            <>
              <Link to="/vault" className="hover:text-futuristic-blue transition-colors">Vault</Link>
              <Link to="/create" className="hover:text-futuristic-blue transition-colors">Create</Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-futuristic-blue transition-colors">Login</Link>
              <Link 
                to="/register" 
                className="px-6 py-2 rounded-full futuristic-gradient text-white font-semibold glow-hover transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
