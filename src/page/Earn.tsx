import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnaylsisCard from "../component/section/AnalysisCard";
import DEGENS from "../component/section/DEGENS";
import HOLDERS from "../component/section/HOLDERS";
import WHALES from "../component/section/WHALES";
import { dispatch, useSelector } from "../store";
import { getTokens } from "../store/reducers/tokens";

function Earn() {
  const tokenState = useSelector((state: any) => state.wallet.user);
  const [tab, setTab] = useState<number>(1);

  const formatNumberWithCommas = useCallback((number: number, locale = "en-US") => {
    return new Intl.NumberFormat(locale).format(number);
  }, []);

  const tabContent = [
    { id: 1, title: "DEGENS", component: DEGENS },
    { id: 2, title: "HOLDERS", component: HOLDERS },
    { id: 3, title: "WHALES", component: WHALES },
  ];
  useEffect(()=>{
    dispatch(getTokens())
  }, [])
  const renderTabContent = useCallback(() => {
    const TabComponent = tabContent.find((item) => item.id === tab)?.component;
    return TabComponent ? <TabComponent /> : null;
  }, [tab]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-color from-gray-900 to-gray-800 px-4 pb-24 pt-5"
    >
      <ToastContainer />
      <AnaylsisCard />
      <div className="relative mt-8 flex flex-col items-center justify-center w-full">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-center items-center gap-4 w-full"
        >
          <div className="flex items-center bg-gray-800 rounded-full px-6 py-3 shadow-lg">
            <img src="/image/dollar.png" alt="" className="w-10 h-10 mr-3" />
            <h1 className="text-4xl text-yellow-400 font-bold">
              {formatNumberWithCommas(tokenState?.score ?? 0)}
            </h1>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 w-full"
        >
          <div className="flex justify-between items-center bg-gray-800 rounded-xl p-1 sticky top-2 z-50 shadow-lg">
            {tabContent.map((item) => (
              <motion.div
                key={item.id}
                className={`cursor-pointer flex-1 text-center py-2 rounded-lg transition-colors ${
                  tab === item.id ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-gray-900" 
                     : "text-gray-400"
                }`}
                onClick={() => setTab(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-sm font-semibold">{item.title}</p>
              </motion.div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Earn;