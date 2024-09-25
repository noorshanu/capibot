// Import statements
import express from 'express';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { Token, Transaction, User } from './models/index.js';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { beginCell, Address, TonClient, JettonMaster, toNano, WalletContractV5R1, internal, external, storeMessage } from '@ton/ton';
import { mnemonicToPrivateKey } from "@ton/crypto";
import { router as tonProofRouter } from './routes/tonProof.js';
import { SHARED_SECRET } from './constants.js';
import rawBody from 'raw-body';

const apiKey = '0ea43ecaca0b6e99244fba349a945ce630e0f9840870f8f8f7cdb03e950debf9';
const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC', apiKey });

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const port = process.env.PORT || 3000;

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
});
app.use('/uploads', express.static('uploads'));
app.use("/api/ton-proof", tonProofRouter);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const welcomeMsg = `👋 Hello there!
    Welcome to the CapyBara and Earn Game, an exciting and fun way to earn rewards while enjoying a simple yet addictive game. Here’s a brief overview of what you can expect:

    🎮 How to Play:

    Tap the "Play" button below to get started.
    You'll be redirected to our game platform where you can start playing immediately.
    The objective is to tap as many times as possible within the given time limit.
    🏆 Earn Rewards:

    The more you tap, the more points you earn.
    Accumulate points to win exciting rewards and move up the leaderboard.
    🔗 Features:

    Easy-to-use interface.
    Instant rewards and bonuses.
    Compete with friends and other players worldwide.
    👥 Community:

    Join our vibrant community of players.
    Share your scores and achievements on social media.
    Ready to start tapping and earning? Hit the "Play" button below and let the fun begin!

    If you have any questions or need assistance, feel free to reach out. Enjoy the game and good luck!

    Best regards,
    The Tap and Earn Team

    Press the "Play" button below to start:`;
const welcomeBtn = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Play', web_app: { url: 'https://www.tapnot.app/' } }]
    ]
  }
}
// // Your existing function to verify Telegram Web App data
const verifyTelegramWebAppData = async (telegramInitData) => {
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get("hash");
  let dataToCheck = [];
  
  initData.sort();
  initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));
  
  const secret = CryptoJS.HmacSHA256(process.env.TELEGRAM_BOT_TOKEN, "WebAppData");
  const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);
  
  return _hash === hash;
};

// // Middleware to check hash
const verifyHashMiddleware = async (req, res, next) => {
  try {
      const isFromBeacon = req.query.source === 'navigatorSendBeacon';
      if (true || isFromBeacon) {
        next()
      } else if (req.headers['auth-type'] !== 'telegram') {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: "authorization header is missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          return res.status(401).json({ error: "token is missing" });
        }

        let decoded;
        try {
          console.log(token, 'token')
          decoded = jwt.verify(token, SHARED_SECRET);
        } catch (err) {
          console.log(err, 'asasasa')
          return res.status(401).json({ error: "invalid token" });
        }

        if (!decoded.address) {
          return res.status(400).json({ error: "address is missing in token" });
        }
        next()
      } else {
        // Assuming the Telegram init data is sent in the request body as `initData`
        const telegramInitData = req.headers.initData;
        
        if (!telegramInitData) {
            return res.status(400).json({ message: 'No initData provided' });
        }
        
        const isValid = await verifyTelegramWebAppData(telegramInitData);
        
        if (!isValid) {
            return res.status(403).json({ message: 'Invalid hash' });
        }
        
        next();
      }
  } catch (error) {
      console.error('Error verifying hash:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
app.post('/api/update-or-insert-user/:userId', verifyHashMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
      const user = await User.findOneAndUpdate(
          { userId },
          req.body,
          { 
              new: true,
              upsert: true,
              setDefaultsOnInsert: true
          }
      );

      res.json({ message: 'User updated or inserted successfully', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});
app.post('/api/update-user/:userId', verifyHashMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
      // Read the raw body data
      const buffer = await rawBody(req);
      const data = buffer.toString('utf-8');
      
      // If data is JSON, parse it
      let parsedData;
      try {
          parsedData = JSON.parse(data);
      } catch (e) {
          parsedData = data; // Fallback to raw string if it's not JSON
      }
      const user = await User.findOneAndUpdate(
          { userId },
          parsedData,
          { 
              new: true,
              upsert: true,
              setDefaultsOnInsert: true
          }
      );

      res.json({ message: 'User updated or inserted successfully', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/update-wallet/:address', verifyHashMiddleware, async (req, res) => {
  const { address } = req.params;
  try {
      const user = await User.findOne({ wallet_address: address });
      if (!user) {
        const user = new User({ wallet_address: address, userId: address })
        await user.save()
      }
      res.json({ message: 'User updated or inserted successfully', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/user-info/:userId', verifyHashMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  
  const condition = type === 'address' ? { wallet_address: userId } : { userId }
  try {
      const user = await User.findOne(condition);

      res.json({ message: 'user info fetched successfully', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});
app.get('/api/tokens-list', async (req, res) => {
  try {
      const tokens = await Token.find({}).sort({ amount: 1 });;
      res.json(tokens);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
})
app.put('/api/update-purchase/:userId', verifyHashMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { transactionHash, tokenId, amount, profitPerHour, profitPerTap } = req.body;
  try {
    await User.updateOne(
      { userId },
      {
        $push: {
          tokens: {
            tokenId: mongoose.Types.ObjectId.createFromHexString(tokenId),
            amount: amount,
            profitPerHour,
            profitPerTap
          },
        }
      }
    );
    const user = await User.findOne({userId})
    console.log(user, '-----ssss-')
    const transaction = new Transaction({
      userId: user._id,
      tokenId: mongoose.Types.ObjectId.createFromHexString(tokenId),
      amount: amount,
      transactionHash,
      status: 'success'
    })
    await transaction.save() 
    res.json({message: 'Updated Successfully'});
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
})
app.put('/api/withdraw/:userId', verifyHashMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { amount, walletAddress } = req.body;
  try {
    const user = await User.findOne({userId})
    if (user && user.score >= amount) {
      const tokenContractAddress = 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT';
      const jettonMasterAddress = Address.parse(tokenContractAddress)
      const userAddress = Address.parse('UQC2DLySWzpObHyTS55JiBeuxCvCnfnikD2jnWtKWggQqUje')
      const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress))
      const jettonWalletAddress = await jettonMaster.getWalletAddress(userAddress)
      const messageBody = beginCell()
          .storeUint(0xf8a7ea5, 32) // Jetton transfer operation code
          .storeUint(0, 64)         // Query ID
          .storeCoins(toNano(amount))       // Amount
          .storeAddress(Address.parse(walletAddress)) // Recipient address
          .storeAddress(Address.parse(walletAddress)) // Response address
          .storeUint(0, 1)         // Custom payload
          .storeCoins(0)           // Forward TON amount
          .storeUint(0, 1)         // Forward payload
          .endCell();
      const mnemonic = process.env.MNEMONIC;
      // Convert mnemonic to key pair
      const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));
        
      // Initialize wallet
      const wallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
      });
        
      // Get wallet contract
      const contract = client.open(wallet);
        
      // Prepare the transfer
      const seqno = await contract.getSeqno();
      const { init } = contract;
      const contractDeployed = await client.isContractDeployed(userAddress);
      let neededInit = null;
    
      if (init && !contractDeployed) {
        neededInit = init;
      }
      const internalMessage = internal({
        to: jettonWalletAddress,
        value: toNano('0.05'),
        bounce: true,
        body: messageBody,
      });
    
      const body = wallet.createTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [internalMessage],
      });
    
      const externalMessage = external({
        to: userAddress,
        init: neededInit,
        body,
      });
    
      const externalMessageCell = beginCell().store(storeMessage(externalMessage)).endCell();
    
      const signedTransaction = externalMessageCell.toBoc();
      const hash = externalMessageCell.hash().toString('hex');
    
      console.log('hash:', hash);
    
      await client.sendFile(signedTransaction);
      await User.updateOne({userId}, {$inc: {score: -amount}})
      const transaction = new Transaction({
        userId: user._id,
        amount: amount,
        transactionHash: hash,
        status: 'success'
      })
      await transaction.save() 
      console.log('Transaction response:', hash);
      res.json({message: 'withdrawal completed Successfully'});
    } else {
      res.status(500).json({ message: 'Insufficient balance' });
    }
    
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
})
app.get('/api/friends-list/:userId', verifyHashMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.find({ referrer: userId });

    res.json(user);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
}
})
// Set up Telegraf bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start(async (ctx)=> {
  const userId = ctx.message.from.id;
  const payload = ctx.startPayload; // Extract the payload
  const exitReferrer = await User.findOne({userId: payload});
  console.log(exitReferrer, 'exit')
  if (exitReferrer || !payload) {
    const dup = await User.findOne({userId: ctx.from.id})
    if (dup) {
      // ctx.reply('Already a member')
    } else {
      // Get the user's profile photos
      const photos = await ctx.telegram.getUserProfilePhotos(userId);
      let fileName = '';
      if (photos?.photos?.[0]?.[0]?.file_id) {
        const file = await ctx.telegram.getFile(photos.photos[0][0].file_id);
        const filePath = file.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;

        // Download the file
        const response = await fetch(fileUrl);
        const buffer = await response.buffer();
        fileName = `uploads/${ctx.message?.from?.first_name}-${Date.now()}.jpg`;
        // Save the file locally
        fs.writeFileSync(fileName, buffer);
      }
      const user = new User({
        userId: ctx.from.id,
        first_name: ctx.message?.from?.first_name,
        language_code: ctx.message?.from?.language_code,
        last_name: ctx.message?.from?.last_name,
        profile_pic: fileName,
        referrer: payload,
        score: 0,
      });
      await user.save()
      if (exitReferrer) {
        let perHour = 0.015;
        if (exitReferrer?.tokens?.length) {
          exitReferrer.tokens.forEach((t)=>{
            perHour += t.profitPerHour ? parseFloat(t.profitPerHour) : 0;
          })
        }
        const profitPerHour = perHour * 0.1
        await User.updateOne(
          { userId: payload },
          {
            $push: {
              tokens: {
                profitPerHour
              },
            }
          }
        );
      }
    }
    // ctx.reply('Welcome to the Tap and Earn Game Demo!', {
    //   reply_markup: {
    //     keyboard: [
    //       [{ text: 'Click Me To Start', web_app: { url: 'https://www.tapnot.app/' } }]
    //     ],
    //     resize_keyboard: true,
    //     one_time_keyboard: false
    //   }
    // });
    ctx.reply(welcomeMsg, welcomeBtn)
  } else {
    ctx.reply(welcomeMsg, {
      reply_markup: {
        keyboard: [
          [{ text: 'Click Me To Start', web_app: { url: 'https://www.tapnot.app/' } }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    });
    ctx.reply(welcomeMsg, welcomeBtn)
  }
})
bot.command('start', async (ctx) => {
  console.log(ctx.from)
  const dup = await User.findOne({userId: ctx.from.id})
  if (!dup) {
    const user = new User({
      userId: ctx.from.id,
      first_name: ctx.message?.from?.first_name,
      language_code: ctx.message?.from?.language_code,
      last_name: ctx.message?.from?.last_name,
      score: 100
    });
    await user.save()
  }
  ctx.reply(welcomeMsg, {
    reply_markup: {
      keyboard: [
        [{ text: 'Click Me To Start', web_app: { url: 'https://www.tapnot.app/' } }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });

  ctx.reply(welcomeMsg, welcomeBtn)
});

bot.on(message('web_app_setup_main_button'), async (ctx) => {
  const data = JSON.parse(ctx.message.web_app_data.data);
  // Save user data to MongoDB
  const user = new User({
    userId: ctx.from.id,
    data: data
  });

  await user.save();

  ctx.reply(`Received data from web app: ${JSON.stringify(data)}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});