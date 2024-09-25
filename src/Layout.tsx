import { Outlet } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { getWallet, updateConeectedStatus, updateLoaderStatus } from "./store/reducers/wallet";
import { dispatch  } from "./store";
import { useState, useEffect, createContext, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { TonProofDemoApi } from "./TonProofApi";
import useInterval from "./hooks/useInterval";


interface User {
  first_name: string;
  last_name?: string;
  profile_pic?: string;
}
export const UserContext = createContext<User | null>(null);

export default function Layout() {
  const [user, setUser] = useState(null);
  const [proof, setProof] = useState(false)
  const walletUser = useSelector((state:any) => state.wallet.user)
  const loading = useSelector((state:any) => state.wallet.loading)
  const transactionLoader = useSelector((state:any) => state.wallet.transactionLoader)

  const wallet = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const firstProofLoading = useRef<boolean>(true);
  useEffect(()=>{
    if (WebApp.initDataUnsafe.user) {
      dispatch(updateLoaderStatus(true))
      dispatch(updateConeectedStatus(true))
      dispatch(getWallet(WebApp.initDataUnsafe.user))
    } else if (wallet) {
      dispatch(updateLoaderStatus(true))
      dispatch(updateConeectedStatus(true))
      dispatch(getWallet({address: wallet}))
    } else {
      dispatch(updateConeectedStatus(false))
      dispatch(updateLoaderStatus(false))
      // alert('Please connect your wallet first!');
    }
  }, [WebApp, wallet, proof])

  useEffect(() => {
    setUser(walletUser);
  }, [walletUser]);

	const recreateProofPayload = useCallback(async () => {
    if (!WebApp.initDataUnsafe.user) {
      if (firstProofLoading.current) {
        tonConnectUI.setConnectRequestParameters({ state: 'loading' });
        firstProofLoading.current = false;
      }

      const payload = await TonProofDemoApi.generatePayload();
      console.log(payload, 'payload')
      if (payload) {
        tonConnectUI.setConnectRequestParameters({ state: 'ready', value: payload });
      } else {
        tonConnectUI.setConnectRequestParameters(null);
      }
    }
	}, [tonConnectUI, firstProofLoading])

	if (firstProofLoading.current) {
		recreateProofPayload();
	}

	useInterval(recreateProofPayload, TonProofDemoApi.refreshIntervalMs);

	useEffect(() =>
		tonConnectUI.onStatusChange(async w => {
      if (WebApp.initDataUnsafe.user) {
        return;
      }
			if (!w) {
				TonProofDemoApi.reset();
				return;
			}

			if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
				await TonProofDemoApi.checkProof(w.connectItems.tonProof.proof, w.account);
        setProof(!proof);
			}

			if (!TonProofDemoApi.accessToken) {
				tonConnectUI.disconnect();
				return;
			}
		}), [tonConnectUI]);

  return (
    <UserContext.Provider value={user}>
      {!loading && <div>
        {transactionLoader && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>}
        <Outlet />
      </div>}
    </UserContext.Provider>
  );
}
