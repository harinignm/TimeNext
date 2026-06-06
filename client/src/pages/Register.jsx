import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-md h-fit"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Join TimeNext</h2>
        
        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 border border-red-500/50">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue transition-all peer pt-6"
              placeholder=" "
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <label className="absolute left-4 top-1 text-xs text-futuristic-blue transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-futuristic-blue">
              Full Name
            </label>
          </div>

          <div className="relative">
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue transition-all peer pt-6"
              placeholder=" "
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <label className="absolute left-4 top-1 text-xs text-futuristic-blue transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-futuristic-blue">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue transition-all peer pt-6"
              placeholder=" "
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <label className="absolute left-4 top-1 text-xs text-futuristic-blue transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:top-1 peer-focus:text-xs peer-focus:text-futuristic-blue">
              Create Password
            </label>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-lg futuristic-gradient font-bold text-white glow-hover shadow-lg transition-all"
          >
            Initialize Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Already a member? <Link to="/login" className="text-futuristic-blue hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
