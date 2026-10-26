import { ethers } from "ethers";

export class DailyCapExceededError extends Error {
  constructor(message = "Daily reward cap of 50 EXPEN reached for this wallet") {
    super(message);
    this.name = "DailyCapExceededError";
    this.code = 429;
  }
}

/**
 * Reward service stub for initial /api/posts integration
 */
export async function claimPostReward(walletAddress) {
  const bytes = ethers.randomBytes(32);
  const txHash = ethers.hexlify(bytes);
  return {
    success: true,
    recipient: walletAddress.toLowerCase(),
    txHash,
    expenRewarded: 10,
    dayTotal: 10,
  };
}
