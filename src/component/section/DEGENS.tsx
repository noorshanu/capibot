import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenCard from ".././TokenCard";
import { useSelector } from '../../store';
import { confirmPurchase } from '../../utils/purchase';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { tokenProps } from '../../types/tokens';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        sendData: (data: string) => void;
        ready: () => void;
      };
    };
  }
}

const DEGENS: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<tokenProps | null>(null);
  const tokenState = useSelector((state: any) => state.wallet.user);
  const tokenProps: tokenProps[] = useSelector(state => state.tokens.tokens);
  const tokens: tokenProps[] = tokenProps?.filter((t) => t.type === 'DEGENS');
  //for (let i in tokens) { 
   // if (tokens[i].title.includes("Airdrop")) {
      //  tokens[i].title = "Airdrop CapybaraCoin";
   // }
//}
console.log(tokens);
  const tokensList = tokenState?.tokens?.length ? tokenState.tokens.map((t: any) => t.tokenId) : [];
  const wallet = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    window.Telegram?.WebApp?.ready();
  }, []);

  const handleBuyToken = (token: tokenProps) => {
    setSelectedToken(token);
  };

  // Function to generate a random pastel color
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Generate and memoize random colors for each token
  const tokenColors = useMemo(() => {
    return tokens.reduce((acc, token) => {
      acc[token._id] = getRandomPastelColor();
      return acc;
    }, {} as Record<string, string>);
  }, [tokens]);
  console.log(tokens);
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-2 sm:p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-xl relative overflow-hidden"
    >
      <motion.h2 
        className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3 md:mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        DEGENS
      </motion.h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <AnimatePresence>
          {tokens.map((token: tokenProps, index) => (
            
            <motion.div
              className={`${tokensList.includes(token._id) ? 'pointer-events-none opacity-30' : ''} overflow-hidden rounded-2xl`}
              key={token.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TokenCard
                image={token.image}
                title={token.title}
                subtitle={token.subtitle}
                value={token.value}
                profitPerHour={token.profitPerHour}
                backgroundColor={tokenColors[token._id]}
                onClick={() => handleBuyToken(token)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedToken && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-x-0 bottom-0 bg-transparent flex items-end justify-center z-50 px-4 pb-10"
          >
            <div 
              className="bg-color from-gray-800 to-gray-900 w-full overflow-hidden rounded-3xl shadow-2xl"
              style={{ maxWidth: '500px' }}
            >
              <div className="h-1 bg-gradient-to-r from-yellow-500/30 via-yellow-500/50 to-yellow-500/30" />
              <div className="px-4 md:px-6 py-4 flex items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 relative mr-4">
                  <img src={selectedToken.image} alt={selectedToken.title} className="w-full h-full object-contain absolute inset-0" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{selectedToken.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm italic">Increase your points by avail booster!</p>
                </div>
                <button 
                  onClick={() => setSelectedToken(null)}
                  className="bg-black bg-opacity-50 rounded-full p-2 transition-transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-4 md:px-6 pb-6">
                <div className="flex items-center justify-between mb-4 bg-gray-800 rounded-lg p-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 relative mr-3">
                    <img src="image/cp.png" alt="Coin" className="w-full h-full object-contain absolute inset-0" />
                  </div>
                  <div>
                    <span className="text-yellow-400 font-semibold text-base md:text-lg">+{selectedToken.profitPerHour}</span>
                    <span className="text-gray-400 ml-2 text-xs md:text-sm">Profit per hour</span>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-semibold text-base md:text-lg">+{selectedToken.profitPerTap}</span>
                    <span className="text-gray-400 ml-2 text-xs md:text-sm">Profit per tap</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-400 text-xs md:text-sm">Upgrade Period:</span>
                  <span className="text-yellow-400 font-semibold text-xs md:text-sm">{selectedToken.upgradePeriod}</span>
                </div>
                <div className="flex items-center justify-between mb-4 bg-gray-800 rounded-lg p-3">
                  <span className="text-gray-400 text-xs md:text-sm">Max Profit:</span>
                  <span className="text-yellow-400 font-semibold text-xs md:text-sm">{selectedToken.maxProfit}</span>
                </div>
                <div className="flex items-center justify-between mb-6 bg-gray-800 rounded-lg p-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 relative mr-3">
                    <img src="image/cp.png" alt="Coin" className="w-full h-full object-contain absolute inset-0" />
                  </div>
                  <span className="text-yellow-400 font-bold text-xl md:text-2xl flex-grow">{selectedToken.value}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmPurchase(tokenState?.userId, selectedToken, setSelectedToken, wallet, tonConnectUI)}
                    className="bg-blue-600 text-white py-2 px-4 md:px-6 rounded-lg font-semibold transition-colors hover:bg-blue-700 text-sm md:text-base"
                  >
                    Go Ahead
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DEGENS;  