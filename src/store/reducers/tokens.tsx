/* eslint-disable @typescript-eslint/no-explicit-any */
// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/api';
import { dispatch } from '../index';

// types
import { tokensStateProps } from '../../types/tokens';

// ----------------------------------------------------------------------

const initialState: tokensStateProps = {
  error: null,
  tokens: []
};

const tokens = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET TOKENS
    getTokensSuccess(state, action) {
      state.tokens = action.payload;
    },
  }
});

// Reducer
export default tokens.reducer;

// ----------------------------------------------------------------------

export function getTokens() {
  return async () => {
    try {
      const response = await axios.get(`/tokens-list`);
      dispatch(tokens.actions.getTokensSuccess(response.data));
    } catch (error) {
      dispatch(tokens.actions.hasError(error));
    }
  };
}
