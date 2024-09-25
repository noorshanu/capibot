import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import InviteCard from "../component/InviteCard";
import FriendCard from "../component/FriendCard";
import { useSelector } from "../store";
import axios from './../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Friends: React.FC = () => {
  const tokenState = useSelector((state: any) => state.wallet.user);
  const [friends, setFriends] = useState([]);
  const shareLink = `https://t.me/Tap_NOT_bot?start=${tokenState?.userId}`;

  const handleInvite = () => {
    window.open(
      `https://t.me/share/url?url=${shareLink}&text=Start earning NOT Coins, Also get 10% Earning on every referrals on NOT GOLD`
    );
  };

  const getFriendsList = useCallback(async () => {
    try {
      const friendList = await axios.get(`/friends-list/${tokenState?.userId}`);
      setFriends(friendList?.data ? friendList.data : []);
    } catch (error) {
      console.error("Error fetching friends list:", error);
      toast.error("Failed to load friends list. Please try again later.");
    }
  }, [tokenState?.userId]);

  useEffect(() => {
    getFriendsList();
  }, [getFriendsList]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success('🎉 Link copied!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy link. Please try again.');
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-color from-gray-900 to-gray-800 px-4 pb-24 pt-5"
    >
      <ToastContainer position="top-center" autoClose={2000} />
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-yellow-400 text-4xl font-bold mb-4"
      >
        Invite Friends!
      </motion.h1>
      <motion.p 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white text-xl pb-6"
        onClick={handleCopy}
      >
        You will receive bonus!
      </motion.p>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-2 py-3"
      >
        <InviteCard title="Share and Earn CapyBaras" profit="10% Tap Earning" />
      </motion.div>

      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-left py-2 text-white text-2xl font-semibold mt-8"
      >
        Your Referrals
      </motion.h2>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 space-y-2"
      >
        {friends.map((f: any, index: number) => (
          <motion.div 
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gray-800 rounded-lg p-3 shadow-lg"
          >
            <FriendCard
              name={f.first_name}
              role={f.level}
              profit={f.score}
              value={f.score}
              profile_pic={f.profile_pic}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center items-center gap-2 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 gradient-color text-gray-900 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-md hover:bg-yellow-400 transition-colors duration-300 w-[70%]"
          onClick={handleInvite}
        >
          Invite your friend
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 gradient-color text-gray-900 p-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-md hover:bg-yellow-400 transition-colors duration-300"
          onClick={handleCopy}
        >
          <img
            src="/image/copy.png"
            alt="Copy"
            className="w-6 h-6"
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Friends;
