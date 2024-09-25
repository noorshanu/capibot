import { beginCell, Address, TonClient, JettonMaster, toNano, JettonWallet } from '@ton/ton';
import { tokenProps } from '../types/tokens';
import api from './api';
import { dispatch } from '../store';
import { getWallet, updateTransactionLoader } from '../store/reducers/wallet';
import WebApp from '@twa-dev/sdk';
import { Cell } from "@ton/core";
import axios from 'axios';

const apiKey = '0ea43ecaca0b6e99244fba349a945ce630e0f9840870f8f8f7cdb03e950debf9';
const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC', apiKey });

const activateBooster = (tokenName: string) => {
    console.log(`Activating booster for ${tokenName}`);
    // Add your booster activation logic here
};

async function waitForConfirmation(transactionHash: any) {
    const maxAttempts = 60; // Polling for a maximum of 5 minutes (60 attempts * 5 seconds)
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            attempts++;
            const result = await axios.get(`https://tonapi.io/v2/blockchain/transactions/${transactionHash}`)
            const isConfirmed = result?.data?.out_msgs?.length; // await waitForConfirmation(response.transactionHash, tonConnectUI);
            
            if (isConfirmed) {
                return result?.data?.hash; // Transaction confirmed
            }
        } catch (err) {
            // Wait for a few seconds before polling again
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    return false; // Transaction not confirmed within the polling period
}


export const confirmPurchase = async (userId: any, selectedToken: tokenProps, setSelectedToken: any, wallet: any, tonConnectUI: any) => {
    if (!selectedToken || !userId) return;
    console.log(`Confirming purchase of ${selectedToken.title} for ${selectedToken.value}`, toNano(selectedToken.amount));
    
    if (!window.Telegram?.WebApp) {
        alert('Telegram WebApp is not available. Please ensure you are using this app within Telegram.');
        return;
    }
    if (!wallet) {
        alert('Please connect your wallet first!');
        return;
    }
    try {
        const tokenContractAddress = 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT';
        const recipientAddress = 'UQC2DLySWzpObHyTS55JiBeuxCvCnfnikD2jnWtKWggQqUje';
        const jettonMasterAddress = Address.parse(tokenContractAddress) // for example EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE
        const userAddress = Address.parse(wallet)
        const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress))
        const jettonWalletAddress = await jettonMaster.getWalletAddress(userAddress)
        console.log(jettonWalletAddress.toString())
        // Open the Jetton Wallet Contract
        const jettonWallet = client.open(JettonWallet.create(jettonWalletAddress));

        // Query the Jetton Wallet Balance
        const balance: any = await jettonWallet.getBalance();
        console.log('Sender Balance:', balance.toString());

        // Define the required amount for the transfer (convert to Nano, consider decimals)
        const requiredAmount = toNano(selectedToken.amount / 100); // Adjust for token decimals (e.g., /100 for 6 decimals)

        // Check if the balance is sufficient
        if (balance.lt(requiredAmount)) {
            alert('Insufficient Jetton balance for the transaction.');
            return; // Exit if the balance is insufficient
        }
        const body = beginCell()
            .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code
            .storeUint(0, 64)                         // query_id:uint64
            .storeCoins(requiredAmount)                     // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)
            .storeAddress(Address.parse(recipientAddress))  // destination:MsgAddress
            .storeAddress(Address.parse(recipientAddress))  // response_destination:MsgAddress
            .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)
            .storeCoins(0)                 // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
            .storeUint(0,1)                           // forward_payload:(Either Cell ^Cell)
            .endCell();
        
        const myTransaction = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: jettonWalletAddress.toString(), // sender jetton wallet
                    amount: toNano(0.05).toString(), // for commission fees, excess will be returned
                    payload: body.toBoc().toString("base64") // payload with jetton transfer body
                }
            ]
        }
        
        const response = await tonConnectUI.sendTransaction(myTransaction);
        console.log(response, 'respo')
        dispatch(updateTransactionLoader(true))
        const cell = Cell.fromBase64(response.boc);
        const buffer = cell.hash()
        const hashHex = buffer.toString('hex')
        const isConfirmed = await waitForConfirmation(hashHex);

        if (isConfirmed) {
            // Proceed with your code if the transaction is confirmed
            console.log('Proceeding with further code execution...');
            // Your code here
            await api.put(`/update-purchase/${userId}`, {
                transactionHash: isConfirmed ? isConfirmed : 'trsansactionhash',
                tokenId: selectedToken._id,
                amount: selectedToken.amount,
                profitPerHour: selectedToken.profitPerHour,
                profitPerTap: selectedToken.profitPerTap
            })
            alert(`Successfully purchased ${selectedToken.title} for ${selectedToken.value}!`);
            activateBooster(selectedToken.title);
            setSelectedToken(null);
            if (WebApp.initDataUnsafe.user) {
                dispatch(getWallet(WebApp.initDataUnsafe.user))
            } else if (wallet) {
                dispatch(getWallet({address: wallet}))
            }
            dispatch(updateTransactionLoader(false))
        } else {
            console.error('Transaction was not confirmed within the polling period.');
            alert('Transaction was not confirmed within the polling period.')
            dispatch(updateTransactionLoader(false))
        }
    } catch (error) {
        console.error('Failed to send token:', error);
        alert('Failed to send token');
        dispatch(updateTransactionLoader(false))
    }
};