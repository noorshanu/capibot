import { useCallback, useEffect } from "react";
import { LEVELPOINTS } from "../config/constants";
import { useSelector } from "../store";
import { updateWallet } from "../store/reducers/wallet";

export default function ProgressBar() {
  const tokenState = useSelector((state: any) => state.wallet.user);
  const userLevel = tokenState?.level ? tokenState.level : 1;
  const score = tokenState?.score ? tokenState.score : 0;
  const nextLevel = userLevel === 10 ? userLevel : userLevel+1;
  const percentage = (score / (LEVELPOINTS[nextLevel]?.points ? LEVELPOINTS[nextLevel]?.points : 500)) * 100
  const updateLevel = useCallback(async ()=>{
    if (percentage >= 100 && tokenState?.level !== 10) {
      updateWallet(tokenState?.userId, {level: tokenState?.level+1})
    }
  }, [percentage, tokenState?.level, tokenState?.userId])
  useEffect(()=>{
    updateLevel()
  }, [updateLevel])
  return (
    <div className="flex flex-col items-end gap-1 justify-center">
      <div className="flex flex-row justify-between text-white text-xs sm:text-sm w-full">
        <h5 className="text-gray-400">{LEVELPOINTS[userLevel]?.name}</h5>
        <div className="flex">
          <h5 className="text-yellow-300">Level</h5>
          <span>
            <h5>&nbsp;{userLevel}/10</h5>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center w-[150px] sm:w-[200px]">
        <div className="w-full h-2 bg-gray-800 rounded-full flex items-center">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}