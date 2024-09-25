import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, TrendingUp, Wallet } from 'lucide-react';

interface FooterItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const FooterItem: React.FC<FooterItemProps> = ({ to, icon, label, isActive }) => (
  <Link to={to} className="flex flex-col items-center justify-center">
    <motion.div
      className={`p-2 ${isActive ? "gradient-color rounded-xl" : ""}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {React.cloneElement(icon as React.ReactElement, {
        size: 24,
        className: `${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-white'} transition-colors`
      })}
    </motion.div>
    <span className={`text-xs mt-1 ${isActive ? "text-yellow-500" : "text-gray-400"}`}>
      {label}
    </span>
  </Link>
);

const Footer: React.FC = () => {
  const location = useLocation();
  const [path, setPath] = useState(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  const footerItems = [
    { to: "/", icon: <Home />, label: "Home" },
    { to: "/friends", icon: <Users />, label: "Friends" },
    { to: "/earn", icon: <TrendingUp />, label: "Booster" },
    { to: "/withdraw", icon: <Wallet />, label: "Withdraw" },
  ];

  return (
    <motion.div 
      className="w-full fixed bottom-0 px-2 max-w-[700px] z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="bg-gray-900 rounded-t-2xl shadow-lg border border-gray-800">
        <motion.div 
          className="flex justify-between items-center py-2 px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {footerItems.map((item) => (
            <motion.div
              key={item.to}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <FooterItem
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={path === item.to}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Footer;
