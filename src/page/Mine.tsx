import { ToastContainer } from "react-toastify";
import AnaylsisCard from "../component/section/AnalysisCard";
import DailyCard from "../component/DailyCard";
import TimeText from "../component/TimeText";
import "react-toastify/dist/ReactToastify.css";
import ComboCard from "../component/ComboCard";
import DEGENS from "../component/section/DEGENS";
import HOLDERS from "../component/section/HOLDERS";
import WHALES from "../component/section/WHALES";
import { useState } from "react";
import { useSelector } from "../store";
function Mine() {
  const tokenState = useSelector((state) => state.wallet.user);
  function formatNumberWithCommas(number: number, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(number);
  }
  const [tab, setTab] = useState<number>(1);
  return (
    <div className="px-4 pb-24 pt-5">
      <ToastContainer />
      <AnaylsisCard />
      <div
        id="mainWindow"
        className="relative mt-2 flex flex-col items-center justify-center w-full"
      >
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <div className="flex flex-row justify-center items-center mt-4">
            <img src="/image/notcoingolden.png" alt="" className="w-14 h-14 mt-1" />
            <h1 className="text-5xl text-white ml-3 font-bold">
              {formatNumberWithCommas(tokenState?.score ? tokenState.score : 0)}
            </h1>
          </div>
          <TimeText />
          <DailyCard />
          <div className="grid grid-cols-3 w-full pt-4 gap-2">
            <ComboCard image="/image/notcoin2.png" content="Text A" />
            <ComboCard image="/image/notcoin2.png" content="Text B" />
            <ComboCard image="/image/notcoin2.png" content="Text C" />
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-10 justify-center items-center bg-[#272A30] py-2 px-4 rounded-xl w-full sticky top-2 z-50 border-[#1B1F24] border-2">
            <div
              className={` cursor-pointer transform origin-bottom transition ${
                tab === 1
                  ? "scale-[110%] opacity-100 bg-[#1B1F24] p-2 max-sm:p-1 rounded-lg"
                  : "opacity-50 text-white"
              }`}
              onClick={() => setTab(1)}
            >
              <p className="text-sm text-white">DEGENS</p>
            </div>
            <div
              className={`cursor-pointer transform origin-bottom transition ${
                tab === 2
                  ? "scale-[110%] opacity-100 bg-[#1B1F24] sm:p-2 p-2 rounded-lg"
                  : "opacity-50 text-white"
              }`}
              onClick={() => setTab(2)}
            >
              <p className="text-sm max-sm:text-[11px]  text-white">HOLDERS</p>
            </div>
            <div
              className={` cursor-pointer transform origin-bottom transition ${
                tab === 3
                  ? "scale-[110%] opacity-100 bg-[#1B1F24] max-sm:p-1 p-2 rounded-lg"
                  : "opacity-50 text-white"
              }`}
              onClick={() => setTab(3)}
            >
              <p className="text-sm  text-white">WHALES</p>
            </div>
          </div>
          <div className="w-full">{tab === 1 && <DEGENS />}</div>
          <div className="w-full">{tab === 2 && <HOLDERS />}</div>
          <div className="w-full">{tab === 3 && <WHALES />}</div>
        </div>
      </div>
    </div>
  );
}

export default Mine;
