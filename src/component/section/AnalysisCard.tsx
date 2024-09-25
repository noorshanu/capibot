import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from '../../store';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <motion.div
    className="bg-gray-800 rounded-lg shadow-md p-3 flex flex-col justify-between h-full border border-opacity-20 border-gray-700"
    whileHover={{ scale: 1.03, rotate: 0.5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex justify-between items-start">
      <h3 className="text-xs font-medium text-gray-400">{title}</h3>
      <motion.div
        className="bg-gray-700 rounded-full p-1.5"
        whileHover={{ rotate: 15 }}
      >
        <span className="text-base">{icon}</span>
      </motion.div>
    </div>
    <div className="mt-2">
      <span className="text-2xl font-bold text-yellow-400">{value}</span>
    </div>
  </motion.div>
);

const AnalysisCard: React.FC = () => {
  const tokenState = useSelector((state: any) => state.wallet.user);
  let perTap = 0.0001;
  let perHour = 0.015;
  if (tokenState?.tokens?.length) {
    tokenState.tokens.forEach((t: any)=>{
      if (new Date(t.lastUpdated).getTime() > (Date.now() - 864000000)) {
        perTap += t.profitPerTap ? parseFloat(t.profitPerTap) : 0;
        perHour += t.profitPerHour ? parseFloat(t.profitPerHour) : 0;
      }
    })
  }
  return (
    <motion.div 
      className="space-y-3 p-3 bg-color from-gray-900 to-gray-800 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Per Tap"
          value={`+${perTap.toFixed(6)}`}
          icon="💰"
        />
        <StatCard
          title="Per Hour"
          value={`+${perHour.toFixed(6)}`}
          icon="⏳"
        />
      </div>
    </motion.div>
  );
};

export default AnalysisCard;