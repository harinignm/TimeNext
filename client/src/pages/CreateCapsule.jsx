import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateCapsule = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    recipientName: '',
    openingDate: '',
    openingTime: '12:00',
    ampm: 'AM',
    message: '',
    capsulePassword: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Parse time
    let [hours, minutes] = formData.openingTime.split(':');
    hours = parseInt(hours);
    if (formData.ampm === 'PM' && hours < 12) hours += 12;
    if (formData.ampm === 'AM' && hours === 12) hours = 0;

    const openingDateTime = new Date(formData.openingDate);
    openingDateTime.setHours(hours, minutes, 0);

    const capsuleData = {
      ...formData,
      senderName: user.name,
      openingDateTime,
      image,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/capsule/create`, capsuleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/vault'), 2000);
    } catch (err) {
      alert('Failed to seal capsule');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <h2 className="text-4xl font-bold text-futuristic-blue mb-4">✨ Capsule sealed successfully.</h2>
          <p className="text-2xl text-white">Locked in time.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">Seal a New Memory</h2>
        
        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">Capsule Title</label>
              <input 
                type="text" required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">Recipient Name</label>
              <input 
                type="text" required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                value={formData.recipientName}
                onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">Opening Date</label>
              <input 
                type="date" required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                value={formData.openingDate}
                onChange={(e) => setFormData({...formData, openingDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">Time (12h)</label>
              <input 
                type="time" required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                value={formData.openingTime}
                onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">AM/PM</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                value={formData.ampm}
                onChange={(e) => setFormData({...formData, ampm: e.target.value})}
              >
                <option value="AM" className="bg-slate-900">AM</option>
                <option value="PM" className="bg-slate-900">PM</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-futuristic-blue ml-1">Your Message</label>
            <textarea 
              required rows="5"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">Capsule Password (Optional)</label>
              <input 
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-futuristic-blue"
                value={formData.capsulePassword}
                onChange={(e) => setFormData({...formData, capsulePassword: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-futuristic-blue ml-1">Attach Image (Optional)</label>
              <input 
                type="file" accept="image/*"
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-futuristic-blue/10 file:text-futuristic-blue hover:file:bg-futuristic-blue/20"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-5 rounded-xl futuristic-gradient text-xl font-bold text-white glow-hover disabled:opacity-50 transition-all"
          >
            {loading ? 'Sealing...' : 'Seal Capsule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCapsule;
