import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, ArrowLeft } from 'lucide-react';

const CapsuleDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const fetchCapsule = async () => {
    try {
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const targetUrl = `${import.meta.env.VITE_API_URL || ''}/api/capsule/${id}`;
      const res = await axios.get(targetUrl, { headers });
      setCapsule(res.data);
    } catch (err) {
      console.error(err);
      const isConfigError = !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === 'undefined';
      const errorMessage = err.response?.data?.error || err.message || 'Unknown network error';
      setFetchError(isConfigError ? 'VITE_API_URL is not set. The frontend doesn\'t know where the backend is.' : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsule();
  }, [id]);

  useEffect(() => {
    if (!capsule || !capsule.openingDateTime) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(capsule.openingDateTime).getTime() - now;
      if (distance < 0) {
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
  }, [capsule]);
  if (loading) return <div className="pt-40 text-center">Loading Capsule...</div>;
  
  if (!capsule) {
    return (
      <div className="pt-40 text-center text-white px-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Capsule not found or connection error.</h2>
        {fetchError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-xl mx-auto text-left font-mono text-sm space-y-2">
            <p className="text-red-400 font-bold">Error: {fetchError}</p>
            <p className="text-slate-400">Target URL: {import.meta.env.VITE_API_URL || '(empty)'}/api/capsule/{id}</p>
            <p className="text-slate-400">VITE_API_URL Value: {import.meta.env.VITE_API_URL || 'undefined'}</p>
            <p className="text-slate-500 text-xs mt-4">
              💡 <b>How to fix this:</b><br />
              1. Make sure your server URL in the environment variables is set correctly.<br />
              2. Make sure it starts with <b>https://</b> (e.g. <i>https://timenext-server.vercel.app</i>).<br />
              3. Remember to redeploy the frontend client on Vercel after saving changes!
            </p>
          </div>
        )}
      </div>
    );
  }

  const isActuallyUnlocked = !capsule.isLocked;

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/vault')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Vault
        </button>

        <AnimatePresence mode="wait">
          {!isActuallyUnlocked ? (
            <motion.div 
              key="locked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-20 h-20 bg-futuristic-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="text-futuristic-blue w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{capsule.title}</h2>
              <p className="text-xl text-slate-400 mb-8">This message is traveling through time… ⏳</p>
              <div className="p-4 bg-white/5 rounded-lg inline-block border border-white/10 text-center">
                <p className="text-futuristic-blue font-mono mb-2">Locked until {new Date(capsule.openingDateTime).toLocaleString()}</p>
                <p className="text-2xl text-white font-bold tracking-widest">{timeLeft}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card overflow-hidden"
            >
              {capsule.image && (
                <div className="w-full max-h-[500px] overflow-hidden bg-black/20 flex justify-center items-center">
                  <img src={capsule.image} alt="Capsule" className="max-w-full max-h-[500px] object-contain" />
                </div>
              )}
              <div className="p-10">
                <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{capsule.title}</h2>
                    <p className="text-slate-400">From: <span className="text-futuristic-blue">{capsule.senderName}</span></p>
                    <p className="text-slate-400">To: <span className="text-futuristic-blue">{capsule.recipientName}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Sealed on</p>
                    <p className="text-slate-300">{new Date(capsule.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-xl leading-relaxed whitespace-pre-wrap text-slate-200">
                    {capsule.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CapsuleDetail;
