import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
        >
          <span className="text-white">Time</span>
          <span className="text-futuristic-blue">Next</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-4xl font-light text-slate-300 mb-4"
        >
          “Preserve your memories… deliver them to the future.”
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-2 mb-12"
        >
          <p className="text-xl text-futuristic-blue/80 italic">“Seal your emotions beyond time.”</p>
          <p className="text-xl text-slate-400">“A secure, futuristic way to send moments forward.”</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link 
            to="/register" 
            className="inline-block px-10 py-4 text-xl font-bold text-white futuristic-gradient rounded-full shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_50px_rgba(0,210,255,0.6)] transition-all transform hover:scale-105"
          >
            Start Your Legacy
          </Link>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Time-Locked", text: "Seal messages until a specific second in the future." },
            { title: "Securely Hashed", text: "Your memories are protected with industry-grade encryption." },
            { title: "Visual History", text: "Upload photos that travel through time with your words." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card p-8 text-left"
            >
              <h3 className="text-2xl font-bold text-futuristic-blue mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
