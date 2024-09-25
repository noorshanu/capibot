import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CheckCom from "../component/check";
import { TonConnectButton } from "@tonconnect/ui-react";

const Airdrop: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 24 * 60 * 60);
  const [canClaim, setCanClaim] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          setCanClaim(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    const days = Math.floor(time / (24 * 60 * 60));
    const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = time % 60;
    return { days, hours, minutes, seconds };
  };

  const handleClaim = async () => {
    setClaiming(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Airdrop claimed successfully!');
    setCanClaim(false);
    setTimeLeft(15 * 24 * 60 * 60);
    setClaiming(false);
  };

  const formattedTime = formatTime(timeLeft);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-color from-gray-900 to-gray-800 p-4 pb-24 flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-10"
      >
        <img src="image/cp.png" className="w-40 h-40" alt="Notcoin" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-4xl font-bold text-yellow-400 mb-8 text-center"
      >
        {canClaim ? 'Airdrop is ready!' : 'Get ready, Airdrop is coming soon!'}
      </motion.h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {Object.entries(formattedTime).map(([unit, value]) => (
          <motion.div
            key={unit}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="bg-gray-800 p-4 rounded-lg text-center"
          >
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-400">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-colors duration-300 ${
          canClaim
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
        onClick={handleClaim}
        disabled={!canClaim || claiming}
      >
        {claiming ? 'Claiming...' : 'Claim Airdrop'}
      </motion.button>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 mb-4"
      >
        <TonConnectButton />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 bg-gray-800 p-4 rounded-lg"
      >
        <div className="flex items-center">
          <CheckCom flag={false} />
          <p className="text-white text-lg ml-2">Airdrop Tasks Will be provided here!</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Airdrop;