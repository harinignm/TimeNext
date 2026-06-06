import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Share2, Lock, Unlock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Vault = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchCapsules = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/capsule/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCapsules(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this capsule?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/capsule/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCapsules(capsules.filter(c => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete');
      }
    }
  };

  const handleShare = (capsule) => {
    const link = `${window.location.origin}/capsule/${capsule._id}`;
    const text = `Check out my time capsule on TimeNext: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="pt-40 text-center text-xl">Accessing Vault...</div>;

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Your Time Vault</h2>
        
        {capsules.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-2xl text-slate-400 mb-6">No capsules yet… Start preserving your memories 💙</p>
            <button 
              onClick={() => navigate('/create')}
              className="px-8 py-3 rounded-full futuristic-gradient text-white font-bold"
            >
              Create Your First Capsule
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capsules.map((capsule) => (
              <CapsuleCard 
                key={capsule._id} 
                capsule={capsule} 
                onDelete={handleDelete}
                onShare={handleShare}
                onView={() => navigate(`/capsule/${capsule._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CapsuleCard = ({ capsule, onDelete, onShare, onView }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(capsule.openingDateTime).getTime() - now;

      if (distance < 0) {
        setIsOpened(true);
        setTimeLeft('OPENED');
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [capsule.openingDateTime]);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{capsule.title}</h3>
        {isOpened ? <Unlock className="text-green-400 w-5 h-5" /> : <Lock className="text-futuristic-blue w-5 h-5" />}
      </div>
      
      <p className="text-slate-400 mb-2">To: <span className="text-slate-200">{capsule.recipientName}</span></p>
      <p className="text-slate-400 mb-6 text-sm">Opens: {new Date(capsule.openingDateTime).toLocaleString()}</p>
      
      <div className="mt-auto">
        <div className={`text-center py-3 rounded-lg mb-6 font-mono text-sm ${isOpened ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-futuristic-blue'}`}>
          {timeLeft}
        </div>

        <div className="flex justify-between gap-2">
          <button 
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm"
          >
            <Eye size={16} /> View
          </button>
          <button 
            onClick={() => onShare(capsule)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm"
          >
            <Share2 size={16} /> Share
          </button>
            <button 
              onClick={() => onDelete(capsule._id)}
              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
            >
              <Trash2 size={16} />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Vault;
