/* eslint-disable @typescript-eslint/no-explicit-any */
// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/api';
import { dispatch } from '../index';

// types
import { walletStateProps } from '../../types/wallet';

// ----------------------------------------------------------------------

const initialState: walletStateProps = {
  error: null,
  connected: false,
  user: {
      userId: '',
      wallet_address: '',
      score: 0,
      energy: 0,
      refill_date: Date.now(),
      hprofit_date: Date.now(),
      tokens: []
  },
  users: [],
  loading: true,
  transactionLoader: false
};

const wallet = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    // GET USER
    getWalletSuccess(state, action) {
      console.log(action.payload, '----payload----')
      state.user = action.payload.user;
      state.loading = false;
    },
    updateLoader(state, action) {
      state.loading = action.payload;
    },
    updateTransLoader(state, action) {
      state.transactionLoader = action.payload;;
    },
    addWalletSuccess(state, action) {
      state.user = action.payload.user;
    },
    updateWalletSuccess(state, action){
      console.log(action.payload.user, 'action.payload.user')
      state.user = action.payload.user;
    },

    updateConnected(state, action) {
      state.connected = action.payload;
    }
    
  }
});

// Reducer
export default wallet.reducer;
// ----------------------------------------------------------------------

export function getWallet(data: any) {
  return async () => {
    const { id, address } = data
    try {
      const response = await axios.get(`/user-info/${address? address : id}?type=${address ? 'address' : 'id'}`);
      dispatch(wallet.actions.getWalletSuccess(response.data));
    } catch (error) {
      dispatch(wallet.actions.hasError(error));
    }
  };
}

export function insertWallet(wallet_address: string) {
  console.log("wallet address---------->", wallet_address);
  return async () => {
    try {
      const response = await axios.post('/wallet/add', {wallet_address: wallet_address});
      dispatch(wallet.actions.addWalletSuccess(response.data));
    } catch (error) {
      dispatch(wallet.actions.hasError(error));
    }
  };
}
export function updateWallet(userId: string, data: any) {
  return async () => {
    try {
      if (userId) {
        const response = await axios.post(`/update-or-insert-user/${userId}`, data);
        dispatch(wallet.actions.updateWalletSuccess(response.data));
      }
    } catch (error) {
      dispatch(wallet.actions.hasError(error));
    }
  };
}

export function updateConeectedStatus(status: boolean) {
  return async () => {
    dispatch(wallet.actions.updateConnected(status))
  }
}


export function updateLoaderStatus(status: boolean) {
  return async () => {
    dispatch(wallet.actions.updateLoader(status))
  }
}
export function updateTransactionLoader(status: boolean) {
  return async () => {
    dispatch(wallet.actions.updateTransLoader(status))
  }
}
