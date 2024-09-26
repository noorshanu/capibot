import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalysisCard from "../component/section/AnalysisCard";
import { dispatch, useSelector } from "../store";
import { updateWallet } from "../store/reducers/wallet";
import { motion, useAnimation } from "framer-motion";
import ProgressBar from "../component/ProgressBar";
import { UserContext } from '../Layout'
import { TonConnectButton } from "@tonconnect/ui-react";
import anime from 'animejs/lib/anime.es.js';

function Home() {
  const tokenState = useSelector((state: any) => state.wallet.user);
  const connectedState = useSelector((state: any) => state.wallet.connected);
  let perTap = 0.0001;
  let perHour = 0.015;
  if (tokenState?.tokens?.length) {
    tokenState.tokens.forEach((t: any) => {
      if (new Date(t.lastUpdated).getTime() > (Date.now() - (86400000 * parseInt(t.upgradePeriod?.split(" ")[0])))) {
        perTap += t.profitPerTap ? parseFloat(t.profitPerTap) : 0;
        perHour += t.profitPerHour ? parseFloat(t.profitPerHour) : 0;
      }
    })
  }
  let totalEnergy = tokenState?.refill_date && tokenState?.energy
    ? Math.max(0, Math.min(0.015, tokenState.energy + ((Date.now() - new Date(tokenState.refill_date).getTime()) / 1000) * 0.0000041667))
    : 0.015;

  const [imgStatus, setImgStatus] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [token, setToken] = useState<number>(tokenState?.score || 0);
  const [remainedEnergy, setRemainedEnergy] = useState<number>(totalEnergy);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState<string>(`+${(perTap*10000)?.toFixed(2)}`);

  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const coinAnimation = useAnimation();

  const scoreRef = useRef(token)
  const energyRef = useRef(remainedEnergy)

  useEffect(()=>{
    scoreRef.current = token;
    energyRef.current = remainedEnergy;
  }, [token, remainedEnergy])

  function formatNumberWithCommas(number: number, locale = "en-US", decimals = 6) {
    return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(number);
  }

  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setImgStatus(true);
    setIsPressed(true);

    coinAnimation.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    });
  };

  const handleInteractionEnd = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setImgStatus(false);
    setIsPressed(false);

    const currentTime = Date.now();
    if (currentTime - lastClickTime < 500) {
      setClickCount(prevCount => prevCount + 1);
    } else {
      setClickCount(1);
    }
    setLastClickTime(currentTime);

    if (remainedEnergy >= perTap) {
      setScore(`+${(perTap*10000)?.toFixed(2)}`);
      setToken(prevToken => prevToken + perTap);
      setRemainedEnergy(prevEnergy => Math.max(0, prevEnergy - perTap));
      handlePointAnimation(event);

      coinAnimation.start({
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 }
      });
    } 
  };

  const handlePointAnimation = (event: React.MouseEvent | React.TouchEvent) => {
    const rect = bodyRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x: number, y: number;
    if ('touches' in event) {
      x = event.touches.length ? event.touches[0].clientX : event.changedTouches[0].clientX - rect.left;
      y = event.touches.length ? event.touches[0].clientY : event.changedTouches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    const newDiv = document.createElement("div");
    newDiv.textContent = `${score}`;
    newDiv.style.position = "absolute";
    newDiv.style.left = `${x}px`;
    newDiv.style.top = `${y}px`;
    newDiv.style.color = "#FFD700";
    newDiv.className = "dynamic-div animate-fadeouttopright transform text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition not-selectable";

    bodyRef.current?.appendChild(newDiv);
    setTimeout(() => newDiv.remove(), 500);

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 bg-yellow-400 rounded-full";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      bodyRef.current?.appendChild(particle);

      anime({
        targets: particle,
        translateX: anime.random(-100, 100),
        translateY: anime.random(-100, 100),
        scale: [1, 0],
        opacity: [1, 0],
        easing: 'easeOutExpo',
        duration: 1000,
        complete: () => particle.remove()
      });
    }
  };

  const updateProfitPerHour = useCallback(() => {
    const differenceMs = tokenState?.hprofit_date && perHour
    ? Date.now() - new Date(tokenState.hprofit_date).getTime()
    : 0;
    const differenceSecs = Math.floor(differenceMs / (1000));
    dispatch(updateWallet(tokenState?.userId, { $inc: { score: differenceSecs * (perHour / 3600) }, hprofit_date: Date.now() }));
  }, [tokenState, perHour])

  useEffect(() => {
    updateProfitPerHour()
    const interval = setInterval(() => {
      setRemainedEnergy((pre) => {
        const newEnergy = Math.min(perHour, pre + 0.0000041667);
        return Math.max(0, newEnergy);
      });
      setToken((pre) => {
        const newToken = pre + (perHour / 3600);
        console.log(newToken)
        return newToken;
      });
    }, 1000);
    const dispatchInterval = setInterval(() => {
      console.log(tokenState?.userId, 'tokenState?.userId', scoreRef.current, 'scoreRef.current', energyRef.current)
      dispatch(updateWallet(tokenState?.userId, { score: scoreRef.current, energy: energyRef.current, refill_date: Date.now(), hprofit_date: Date.now() }));
    }, 60000);
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue = ''; 

      const data = {
        score: scoreRef.current,
        energy: energyRef.current,
        refill_date: Date.now(),
        hprofit_date: Date.now(),
      };

      navigator.sendBeacon(`https://api.capybaraminister.com/api/update-user/${tokenState?.userId}`, JSON.stringify(data));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      dispatch(updateWallet(tokenState?.userId, {
        score: scoreRef.current,
        energy: energyRef.current,
        refill_date: Date.now(),
        hprofit_date: Date.now(),
      }))
      clearInterval(interval);
      clearInterval(dispatchInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  const user = useContext(UserContext);

  return (
    <div className="min-h-screen overflow-hidden bg-color from-gray-900 to-gray-800 flex flex-col">
      <ToastContainer />
      <div className="pt-2 sm:pt-3 px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src={user?.profile_pic ? `https://api.capybaraminister.com/${user.profile_pic}` : "/image/60111.jpg"} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-black border-2"
            alt="User profile"
          />
          <div className="text-white text-xs sm:text-sm md:text-base">
            {user?.first_name 
              ? `${user.first_name} ${user.last_name || ''}`
              : <TonConnectButton />
            }
          </div>
        </div>
        <ProgressBar />
      </div>
      {!connectedState && (
        <div className="bg-red-500 text-white py-1 mt-1 flex items-center justify-center">
          Please connect your wallet first!
        </div>
      )}
      <div className="flex-grow overflow-y-auto px-2 sm:px-4 py-2 sm:py-4">
        <AnalysisCard />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-2 sm:mt-4 flex flex-col items-center justify-center w-full"
        >
          <div className="flex flex-col justify-center items-center mb-2 sm:mb-4 gap-2 w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-row justify-center items-center bg-gray-800 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg"
            >
              <img
                src="/image/notcoingolden.png"
                alt=""
                className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-yellow-400 font-bold">
                {formatNumberWithCommas(token)}
              </h1>
            </motion.div>
          </div>
          <div className="w-4/5 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-md mx-auto">
            <motion.div
              animate={coinAnimation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.85 }}
              className={`relative bg-[url('/image/cp.png')] rounded-full bg-cover w-full justify-center items-center aspect-square z-10 ${
                remainedEnergy >= perTap
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              } ${imgStatus ? "border-4 border-yellow-400" : ""} transition-all duration-200 ${
                isPressed ? "scale-95" : "scale-100"
              }`}
              ref={bodyRef}
              onMouseDown={handleInteractionStart}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={() => {
                setImgStatus(false);
                setIsPressed(false);
              }}
              onTouchStart={handleInteractionStart}
              onTouchEnd={handleInteractionEnd}
            >
              {clickCount > 1 && (
                <div className="">
                </div>
              )}
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-row justify-between w-full mt-2 sm:mt-4 mb-2 sm:mb-4"
          >
            <div className="flex justify-between w-full bg-gray-800 rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl text-white flex items-center">
                <img
                  src="/image/icon/lightning.svg"
                  alt="lightning"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2"
                />
                <span className="text-yellow-400 font-semibold">{formatNumberWithCommas(remainedEnergy*10000, 'en-US', 0)}</span>
                <span className="text-gray-400 ml-1">/ {formatNumberWithCommas(perHour*10000, 'en-US', 0)}</span>
              </h3>
            </div>
          </motion.div> 
        </motion.div>
      </div>
    </div>
  );
}

export default Home;