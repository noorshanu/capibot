import mongoose from 'mongoose';

// Define your schema and model
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    wallet_address: { type: String, default: ''},
    energy: { type: Number, default: 0.015 },
    score: { type: Number, default: 0},
    level: { type: Number, default: 1},
    first_name: { type: String },
    last_name: { type: String },
    language_code: { type: String },
    referrer: { type: String },
    profile_pic: { type: String },
    refill_date: {
        type: Date,
        default: new Date(Date.now()), // Sets the current date and time by default
    },
    hprofit_date: {
        type: Date,
        default: new Date(Date.now()),
    },
    tokens: [{
        tokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', required: false },
        amount: { type: Number, default: 0 },
        profitPerHour: { type: Number, default: 0 },
        profitPerTap: { type: Number, default: 0},
        lastUpdated: { type: Date, default: new Date(Date.now()) }
    }],
});

const TokenSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    value: { type: String, required: true },
    amount: { type: Number, required: true },
    profitPerHour: { type: String, required: true },
    profitPerTap: { type: String, required: true },
    upgradePeriod: { type: String, required: true },
    maxProfit: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    type: { type: String, required: true }, // New field to specify the type of token
});

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
    amount: { type: Number, required: true }, // Amount in smallest units
    transactionHash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' } // pending, completed, failed
});
  
export const Transaction = mongoose.model('Transaction', TransactionSchema);
export const User = mongoose.model('User', UserSchema);
export const Token = mongoose.model('Token', TokenSchema);