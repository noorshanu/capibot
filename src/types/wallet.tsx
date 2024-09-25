export interface walletProfile {
    userId: string;
    wallet_address: string;
    score: number;
    energy: number;
    refill_date: number;
    tokens?: any;
    hprofit_date?: number;
}
export interface walletStateProps {
    connected: boolean;
    user: walletProfile;
    users: walletProfile[];
    error: object | string | null;
    loading: boolean;
    transactionLoader: boolean;
}