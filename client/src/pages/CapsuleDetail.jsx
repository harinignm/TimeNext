import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Lock, Clock, ArrowLeft } from 'lucide-react';

const CapsuleDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchCapsule = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/capsule/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCapsule(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsule();
  }, [id]);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/capsule/verify-password`, 
        { id, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCapsule({ ...res.data.capsule, isLocked: false });
    } catch (err) {
      setError('Invalid password');
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) return <div className="pt-40 text-center">Loading Capsule...</div>;
  if (!capsule) return <div className="pt-40 text-center">Capsule not found.</div>;

  const isActuallyUnlocked = new Date() >= new Date(capsule.openingDateTime);

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
              <div className="p-4 bg-white/5 rounded-lg inline-block border border-white/10">
                <p className="text-futuristic-blue font-mono">Locked until {new Date(capsule.openingDateTime).toLocaleString()}</p>
              </div>
            </motion.div>
          ) : capsule.capsulePassword && capsule.isLocked !== false ? (
            <motion.div 
              key="password-protected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 max-w-md mx-auto text-center"
            >
              <Lock className="text-futuristic-blue w-12 h-12 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-6">Password Protected</h2>
              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <input 
                  type="password"
                  placeholder="Enter capsule password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 rounded-lg futuristic-gradient font-bold text-white"
                >
                  {isVerifying ? 'Verifying...' : 'Unlock Content'}
                </button>
              </form>
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
