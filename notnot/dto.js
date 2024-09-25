import { z } from "zod";

const TonAddress = z.string();

export const GenerateTonProofPayload = z.object({
  payload: z.string(),
});

const TonDomain = z.object({
  lengthBytes: z.number(),
  value: z.string(),
});

const TonProof = z.object({
  domain: TonDomain,
  payload: z.string(),
  signature: z.string(),
  state_init: z.string(),
  timestamp: z.number(),
});

const TonNetwork = z.union([
  z.literal("-239").transform(() => "MAINNET"),
  z.literal("-3").transform(() => "TESTNET"),
]);

export const CheckProofPayload = z.object({
  address: TonAddress,
  network: TonNetwork,
  proof: TonProof,
});

export const CheckTonProofSuccess = z.object({
  token: z.string(),
});

export const CheckTonProofError = z.object({
  error: z.string(),
});

export const CheckTonProof = z.union([
  CheckTonProofSuccess,
  CheckTonProofError,
]);

export const WalletAddress = z.object({
  address: z.string(),
});
