import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { dispatch, useSelector } from '../store';
import api from '../utils/api';
import { getWallet, updateWallet } from '../store/reducers/wallet';
import WebApp from '@twa-dev/sdk';

const Withdraw: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const tokenState = useSelector((state: any) => state.wallet.user);
  const [withdrawing, setWithdrawing] = useState(false);
  const wallet = useTonAddress();

  const formatNumberWithCommas = useCallback((number: number, locale = "en-US") => {
    return new Intl.NumberFormat(locale).format(number);
  }, []);

  useEffect(() => {
    if (wallet) {
      if (WebApp.initDataUnsafe.user) {
        dispatch(updateWallet(tokenState?.userId, { wallet_address: wallet }));
      } else {
        updateWalletAddress()
      }
    }
  }, [wallet])

  const updateWalletAddress = async () => {
    console.log(wallet, 'wallet')
    await api.put(`/update-wallet/${wallet}`, {
      userId: wallet,
      wallet_address: wallet,
    })
    dispatch(getWallet({address: wallet}))
  }

  const handleWithdraw = async () => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 50) {
      alert('Please enter a valid amount minimum 50 NOT');
      return;
    }
    const availAmount = tokenState?.score ? tokenState.score : 0;
    if (availAmount < amount) {
      alert("Insufficient balance");
      return;
    }
    setWithdrawing(true);
    try {
      // Here you would typically interact with your smart contract to process the withdrawal
      // For this example, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await api.put(`withdraw/${tokenState?.userId}`, {amount, walletAddress: wallet});
      
      alert(`Successfully initiated withdrawal of ${amount} NOT to ${wallet}`);
      setWithdrawAmount('');
      window.location.reload();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Failed to process withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

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

      <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center items-center gap-4 w-full"
        >
          <div className="flex items-center bg-gray-800 rounded-full px-6 py-3 shadow-lg">
            <img src="/image/notcoingolden.png" alt="" className="w-10 h-10 mr-3" />
            <h1 className="text-4xl text-yellow-400 font-bold">
              {formatNumberWithCommas(tokenState?.score ?? 0)}
            </h1>
          </div>
        </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl font-bold text-yellow-400 mb-8 text-center mt-4"
      >
        Withdraw Your CAPY
      </motion.h1>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gray-800 p-6 rounded-lg mb-8 w-full max-w-md"
      >
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter amount to withdraw (minimum 50)"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full px-8 py-3 rounded-full text-white font-bold text-lg transition-colors duration-300 ${
            wallet && !withdrawing
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
          onClick={handleWithdraw}
          disabled={!wallet || withdrawing}
        >
          {withdrawing ? 'Processing...' : 'Withdraw'}
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mb-4"
      >
        <TonConnectButton />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 bg-gray-800 p-4 rounded-lg"
      >
        <p className="text-white text-lg">
          Min Withdrawal: 50 CAPY<br/>
          Max Withdrawal: No Limit
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Withdraw;