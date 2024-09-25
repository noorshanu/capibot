import {
    Account,
    ConnectAdditionalRequest,
    TonProofItemReplySuccess
  } from "@tonconnect/ui-react";
  import './path-local-storage';
import api from "./utils/api";
  
  class TonProofDemoApiService {
    private localStorageKey = 'api-access-token';
  
    public accessToken: string | null = null;
  
    public readonly refreshIntervalMs = 9 * 60 * 1000;
  
    constructor() {
      this.accessToken = localStorage.getItem(this.localStorageKey);
  
      if (!this.accessToken) {
        this.generatePayload();
      }
    }
  
    async generatePayload(): Promise<ConnectAdditionalRequest | null> {
      try {
        const response: any = await api.post(`/ton-proof/generate-payload`, {})
        return {tonProof: response.data.payload as string};
      } catch {
        return null;
      }
    }
  
    async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account): Promise<void> {
      try {
        const reqBody = {
          address: account.address,
          network: account.chain,
          public_key: account.publicKey,
          proof: {
            ...proof,
            state_init: account.walletStateInit,
          },
        };

        const response: any = await api.post(`/ton-proof/check-proof`, reqBody)
  
        if (response?.data?.token) {
          localStorage.setItem(this.localStorageKey, response.data.token);
          this.accessToken = response.data.token;
        }
      } catch (e) {
        console.log('checkProof error:', e);
      }
    }
  
    async getAccountInfo() {
      const response = await api.get(`/ton-proof/get-account-info`, {
        headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
        }
      });
  
      return response.data as {};
    }
  
    reset() {
      this.accessToken = null;
      localStorage.removeItem(this.localStorageKey);
      this.generatePayload();
    }
  }
  
  export const TonProofDemoApi = new TonProofDemoApiService();