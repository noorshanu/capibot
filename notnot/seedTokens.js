// seedTokens.js
import mongoose from 'mongoose';
import { Token } from './models/index.js';
import dotenv from 'dotenv';
// import TonWeb from "tonweb";
// import nacl from "tweetnacl";

// (async () => {
//   const tonwebInstance = new TonWeb();

//   // Create a key pair
//   const keyPair = nacl.sign.keyPair();

//   // Extract the public key from the key pair
//   const publicKey = keyPair.publicKey;
//   const publicKeyHex = Buffer.from(publicKey).toString("hex");

//   // Extract the private key from the key pair
//   const privateKey = keyPair.secretKey;
//   const privateKeyHex = Buffer.from(privateKey).toString("hex");

//   // Create a wallet using the public key as Uint8Array
//   const wallet = tonwebInstance.wallet.create({publicKey});

//   // Get the wallet address
//   const walletAddress = (await wallet.getAddress()).toString(true, true, true);

//   console.log("Wallet address:", walletAddress);
//   console.log("Public key (hex):", publicKeyHex);
//   console.log("Private key (hex):", privateKeyHex);
//   console.log("publicKey key:", publicKey);
//   console.log("Private key:", privateKey);
// })();

dotenv.config();

const mongoUri = process.env.MONGO_URI; // Replace with your MongoDB URI

const tokens = [
    { 
        image: "/image/cp.png", 
        title: "Airdrop CapyBara Coin", 
        subtitle: "500 CAPY / 1250 CAPY", 
        value: "500 CAPY", 
        profitPerHour: "2.6",
        profitPerTap: "0.00115",
        upgradePeriod: "10 days",
        maxProfit: "1250 CAPY",
        backgroundColor: "bg-gradient-to-br from-blue-400/50 to-blue-800/20 backdrop-blur-md",
        type: "DEGENS",
        amount: 500
    },
    { 
        image: "/image/not1.png", 
        title: "Tap CapyBara", 
        subtitle: "1250 CAPY / 3750 CAPY", 
        value: "1250 CAPY", 
        profitPerHour: "7.8",
        profitPerTap: "0.00345",
        upgradePeriod: "10 days",
        maxProfit: "3750 CAPY",
        backgroundColor: "bg-gradient-to-br from-red-400/20 to-red-800/20 backdrop-blur-md",
        type: "DEGENS",
        amount: 1250
    },
    { 
        image: "/image/not2.png", 
        title: "Task CapyBara", 
        subtitle: "2500 CAPY / 7500 CAPY", 
        value: "2500 CAPY", 
        profitPerHour: "15.65",
        profitPerTap: "0.00695",
        upgradePeriod: "10 days",
        maxProfit: "7500 CAPY",
        backgroundColor: "bg-gradient-to-br from-green-400/20 to-green-800/20 backdrop-blur-md",
        type: "DEGENS",
        amount: 2500
    },
    { 
        image: "/image/not3.png", 
        title: "Trending CapyBara", 
        subtitle: "5000 CAPY / 9500 CAPY", 
        value: "5000 CAPY", 
        profitPerHour: "13.2",
        profitPerTap: "0.00585",
        upgradePeriod: "15 days",
        maxProfit: "9500 CAPY",
        backgroundColor: "bg-gradient-to-br from-purple-400/20 to-purple-800/20 backdrop-blur-md",
        type: "DEGENS",
        amount: 5000
    },
    { 
        image: "/image/not4.png", 
        title: "Viral CapyBara", 
        subtitle: "12500 CAPY / 23750 CAPY", 
        value: "12500 CAPY", 
        profitPerHour: "13.2",
        profitPerTap: "0.01465",
        upgradePeriod: "15 days",
        maxProfit: "23750 CAPY",
        backgroundColor: "bg-gradient-to-br from-yellow-400/20 to-yellow-800/20 backdrop-blur-md",
        type: "DEGENS",
        amount: 12500
    },
    { 
        image: "/image/not5.png", 
        title: "50x CapyBara", 
        subtitle: "20k CAPY / 38k CAPY", 
        value: "20k CAPY", 
        profitPerHour: "52.8",
        profitPerTap: "0.0234",
        upgradePeriod: "15 days",
        maxProfit: "38k CAPY",
        backgroundColor: "bg-gradient-to-br from-pink-400/20 to-pink-800/20 backdrop-blur-md",
        type: "DEGENS",
        amount: 20000
    },
    { 
        image: "/image/not1.png", 
        title: "10M telegram", 
        subtitle: "50000 CAPY / 105k CAPY", 
        value: "50000 CAPY", 
        profitPerHour: "146",
        profitPerTap: "0.0648",
        upgradePeriod: "15 days",
        maxProfit: "105k CAPY",
        backgroundColor: "bg-gradient-to-br from-blue-400/50 to-blue-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 50000
    },
    { 
        image: "/image/not2.png", 
        title: "All Time High", 
        subtitle: "75000 CAPY / 175.5k CAPY", 
        value: "75000 CAPY", 
        profitPerHour: "218",
        profitPerTap: "0.0972",
        upgradePeriod: "15 days",
        maxProfit: "175.5k CAPY",
        backgroundColor: "bg-gradient-to-br from-red-400/20 to-red-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 75000
    },
    { 
        image: "/image/not1.png", 
        title: "TOP 10 CMC", 
        subtitle: "100K CAPY / 210K CAPY", 
        value: "100K CAPY", 
        profitPerHour: "291",
        profitPerTap: "0.147",
        upgradePeriod: "15 days",
        maxProfit: "210K CAPY",
        backgroundColor: "bg-gradient-to-br from-green-400/20 to-green-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 100000
    },
    { 
        image: "/image/not2.png", 
        title: "TOP Memes", 
        subtitle: "125k CAPY / 263.5K CAPY", 
        value: "125k CAPY", 
        profitPerHour: "364",
        profitPerTap: "0.162",
        upgradePeriod: "15 days",
        maxProfit: "263.5K CAPY",
        backgroundColor: "bg-gradient-to-br from-purple-400/20 to-purple-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 125000
    },
    { 
        image: "/image/not3.png", 
        title: "Top Trading Vol", 
        subtitle: "150k CAPY / 315K CAPY", 
        value: "150k CAPY", 
        profitPerHour: "427.5",
        profitPerTap: "0.195",
        upgradePeriod: "15 days",
        maxProfit: "315K CAPY",
        backgroundColor: "bg-gradient-to-br from-yellow-400/20 to-yellow-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 150000
    },
    { 
        image: "/image/not4.png", 
        title: "Price Prediction", 
        subtitle: "175k CAPY / 367.5k CAPY", 
        value: "175k CAPY", 
        profitPerHour: "510",
        profitPerTap: "0.226",
        upgradePeriod: "15 days",
        maxProfit: "367.5k CAPY",
        backgroundColor: "bg-gradient-to-br from-indigo-400/20 to-indigo-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 175000
    },
    { 
        image: "/image/not5.png", 
        title: "40 Billion MC", 
        subtitle: "200k CAPY / 420k CAPY", 
        value: "200k CAPY", 
        profitPerHour: "583",
        profitPerTap: "0.26",
        upgradePeriod: "15 days",
        maxProfit: "420k CAPY",
        backgroundColor: "bg-gradient-to-br from-pink-400/20 to-pink-800/20 backdrop-blur-md",
        type: "HOLDERS",
        amount: 200000
    },
    { 
        image: "/image/not6.png", 
        title: "11.5M Hodlers", 
        subtitle: "250K CAPY / 587K CAPY", 
        value: "250K CAPY", 
        profitPerHour: "815",
        profitPerTap: "0.376",
        upgradePeriod: "15 days",
        maxProfit: "587K CAPY",
        backgroundColor: "bg-gradient-to-br from-blue-400/50 to-blue-800/20 backdrop-blur-md",
        type: "WHALES",
        amount: 250000
      },
      { 
        image: "/image/whales/kucoin.svg", 
        title: "Kucoin", 
        subtitle: "375K CAPY / 881K CAPY", 
        value: "375K CAPY", 
        profitPerHour: "1074",
        profitPerTap: "0.544",
        upgradePeriod: "15 days",
        maxProfit: "881K CAPY",
        backgroundColor: "bg-gradient-to-br from-red-400/20 to-red-800/20 backdrop-blur-md",
        type: "WHALES",
        amount: 375000
      },
      { 
        image: "/image/whales/bitfinex.png", 
        title: "Bitfinex", 
        subtitle: "500k CAPY / 1.175M CAPY", 
        value: "500k CAPY", 
        profitPerHour: "1632",
        profitPerTap: "0.725",
        upgradePeriod: "15 days",
        maxProfit: "1.175M CAPY",
        backgroundColor: "bg-gradient-to-br from-green-400/20 to-green-800/20 backdrop-blur-md",
        type: "WHALES",
        amount: 500000
      },
      { 
        image: "/image/whales/gateio.png", 
        title: "Gate io", 
        subtitle: "750k CAPY / 1.762M CAPY", 
        value: "750k CAPY", 
        profitPerHour: "2450",
        profitPerTap: "1.09",
        upgradePeriod: "15 days",
        maxProfit: "1.762M CAPY",
        backgroundColor: "bg-gradient-to-br from-yellow-400/20 to-yellow-800/20 backdrop-blur-md",
        type: "WHALES",
        amount: 750000
      },
      { 
        image: "/image/whales/bybit.png", 
        title: "Bybit", 
        subtitle: "1M CAPY / 2.350M CAPY", 
        value: "1M CAPY", 
        profitPerHour: "3263",
        profitPerTap: "1.45",
        upgradePeriod: "15 days",
        maxProfit: "2.350M CAPY",
        backgroundColor: "bg-gradient-to-br from-indigo-400/20 to-indigo-800/20 backdrop-blur-md",
        type: "WHALES",
        amount: 1000000
      },
      { 
        image: "/image/whales/binance.svg", 
        title: "Binance", 
        subtitle: "1.5M CAPY / 4.350M CAPY", 
        value: "1.5M CAPY", 
        profitPerHour: "6050",
        profitPerTap: "2.685",
        upgradePeriod: "15 days",
        maxProfit: "4.350M CAPY",
        backgroundColor: "bg-gradient-to-br from-pink-400/20 to-pink-800/20 backdrop-blur-md",
        type: "WHALES",
        amount: 1500000
      }
];

async function seedTokens() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    await Token.deleteMany({}); // Clear existing data

    const result = await Token.insertMany(tokens);
    console.log('Tokens inserted:', result);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding tokens:', error);
  }
}

seedTokens();
