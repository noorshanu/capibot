import React from 'react';
import { motion } from 'framer-motion';

interface InviteCardProps {
  title: string;
  profit: string;
}

const InviteCard: React.FC<InviteCardProps> = ({ title, profit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="w-full"
    >
      <motion.div 
        className="rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:p-6 shadow-lg relative overflow-hidden"
        whileHover={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)" }}
      >
        <motion.div 
          className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-yellow-500 opacity-10 rounded-full"
          style={{ filter: 'blur(40px)' }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="flex items-start space-x-3 md:space-x-4">
          <motion.img
            src="/image/gift.svg"
            alt="Gift"
            className="w-10 h-10 md:w-16 md:h-16"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex-grow">
            <h2 className="text-white text-base md:text-xl font-bold mb-1 md:mb-2">{title}</h2>
            <div className="flex flex-wrap items-center space-x-1 md:space-x-2">
              <img src="/image/dot.png" alt="" className="w-2 h-2 md:w-4 md:h-4" />
              <img src="/image/notcoingolden.png" alt="" className="w-3 h-3 md:w-5 md:h-5" />
              <p className="text-yellow-400 font-semibold text-xs md:text-base">+{profit}</p>
              <p className="text-yellow-400 font-semibold text-xs md:text-base">/ Per Hour</p>
            </div>
          </div>
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default InviteCard;