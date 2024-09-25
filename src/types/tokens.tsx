export interface tokenProps {
    image: string,
    title: string,
    subtitle: string,
    value: string,
    profitPerHour: string,
    profitPerTap: string,
    upgradePeriod: string,
    maxProfit: string,
    backgroundColor: string,
    type: string,
    _id?: any,
    amount: any
}
export interface tokensStateProps {
    tokens: tokenProps[];
    error: object | string | null;
}