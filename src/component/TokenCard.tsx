import React from 'react';
import { motion } from 'framer-motion';

interface TokenCardProps {
  image: string;
  title: string;
  subtitle: string;
  value: string;
  profitPerHour: string;
  backgroundColor: string;
  onClick?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({
  image,
  title,
  subtitle,
  value,
  profitPerHour,
  backgroundColor,
  onClick
}) => {
  // Function to darken a color
  const darkenColor = (color: string, amount: number) => {
    return color.replace(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/, (_, h, s, l) => {
      return `hsl(${h}, ${s}%, ${Math.max(0, parseInt(l) - amount)}%)`;
    });
  };

  const darkColor = darkenColor(backgroundColor, 40); // Darken by 40%
  const darkerColor = darkenColor(backgroundColor, 60); // Darken by 60%

  const backgroundGradient = `linear-gradient(to bottom, ${backgroundColor}, ${darkColor}, ${darkerColor})`;

  return (
    <motion.div 
      className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg relative"
      style={{
        background: backgroundGradient,
      }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* Darker overlay with rounded corners */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-3 rounded-2xl">
        <div className="relative w-full h-2/5 mb-2">
          <img
            src={image}
            alt={title}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 object-contain"
          />
        </div>
        <div className='flex flex-col gap-1 flex-grow'>
          <div className="flex-grow">
            <h2 className="text-white text-sm sm:text-base font-bold truncate">{title}</h2>
            <p className="text-blue-200 text-xs sm:text-sm truncate opacity-80">{subtitle}</p>
          </div>
          <div className="flex flex-col justify-end space-y-1 mt-auto">
            <div className="flex items-center justify-between bg-black bg-opacity-30 rounded-lg p-1.5">
              <span className="text-gray-300 text-xs">Value</span>
              <div className="flex items-center">
                <img
                  src="/image/notcoin2.png"
                  alt="coin"
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                />
                <p className="text-yellow-400 text-xs sm:text-sm font-bold">{value}</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-black bg-opacity-30 rounded-lg p-1.5">
              <span className="text-gray-300 text-xs">Profit/Hour</span>
              <div className="flex items-center">
                <img
                  src="/image/notcoin2.png"
                  alt="coin"
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                />
                <p className="text-yellow-400 text-xs sm:text-sm font-bold">{profitPerHour}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TokenCard;