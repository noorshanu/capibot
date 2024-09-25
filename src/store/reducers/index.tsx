// third-party
import { combineReducers } from 'redux';

// project import
import wallet from './wallet';
import tokens from './tokens';


// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  wallet,
  tokens
});

export default reducers;
