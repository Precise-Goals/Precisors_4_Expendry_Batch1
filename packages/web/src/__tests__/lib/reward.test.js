import { describe, it, expect, beforeEach } from "bun:test";
import { ethers } from "ethers";
import {
  claimPostReward,
  getDailyTally,
  DailyCapExceededError,
  dailyTallies,
  getDayIndex,
} from "../../lib/reward.js";

describe("EXPEN Reward Service & Daily Cap Enforcement", () => {
  let recipientWallet;
  let mockContract;
  let mockDb;
  let storedRewards;
  let mintCalls;

  beforeEach(() => {
    recipientWallet = ethers.Wallet.createRandom().address.toLowerCase();
    dailyTallies.clear();
    mintCalls = [];
    storedRewards = new Map();

    mockContract = {
      mint: async (to, amountWei) => {
        mintCalls.push({ to: to.toLowerCase(), amountWei });
        return {
          hash: ethers.hexlify(ethers.randomBytes(32)),
        };
      },
    };

    mockDb = {
      collection: (colName) => ({
        doc: (docId) => ({
          get: async () => {
            if (storedRewards.has(docId)) {
              return { exists: true, data: () => storedRewards.get(docId) };
            }
            return { exists: false, data: () => null };
          },
          set: async (data) => {
            storedRewards.set(docId, data);
          },
        }),
      }),
    };
  });

  it("mints 10 EXPEN on first post and records transaction hash", async () => {
    const result = await claimPostReward(recipientWallet, {
      contract: mockContract,
      adminDb: mockDb,
    });

    expect(result.success).toBe(true);
    expect(result.recipient).toBe(recipientWallet);
    expect(result.expenRewarded).toBe(10);
    expect(result.dayTotal).toBe(10);
    expect(result.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(mintCalls.length).toBe(1);
    expect(mintCalls[0].to).toBe(recipientWallet);
    expect(mintCalls[0].amountWei).toBe(ethers.parseUnits("10", 18));
  });

  it("allows up to 5 consecutive posts (50 EXPEN total) on the same day", async () => {
    for (let i = 1; i <= 5; i++) {
      const res = await claimPostReward(recipientWallet, {
        contract: mockContract,
        adminDb: mockDb,
      });
      expect(res.dayTotal).toBe(i * 10);
    }

    expect(mintCalls.length).toBe(5);
    const finalTally = await getDailyTally(recipientWallet, getDayIndex(), mockDb);
    expect(finalTally).toBe(50);
  });

  it("rejects 6th post when 50 EXPEN daily cap is reached and does not call contract mint", async () => {
    // Mint 5 posts to reach 50 EXPEN
    for (let i = 1; i <= 5; i++) {
      await claimPostReward(recipientWallet, {
        contract: mockContract,
        adminDb: mockDb,
      });
    }

    expect(mintCalls.length).toBe(5);

    // 6th post must throw DailyCapExceededError
    expect(
      claimPostReward(recipientWallet, {
        contract: mockContract,
        adminDb: mockDb,
      })
    ).rejects.toThrow(DailyCapExceededError);

    // Ensure mint was NOT called for the 6th attempt
    expect(mintCalls.length).toBe(5);
  });

  it("resets daily cap when calendar day rolls over", async () => {
    const day1Timestamp = Date.now();
    const day2Timestamp = day1Timestamp + 86400000 + 1000; // 24 hours + 1 second later

    // Mint 50 EXPEN on day 1
    for (let i = 1; i <= 5; i++) {
      await claimPostReward(recipientWallet, {
        contract: mockContract,
        adminDb: mockDb,
        timestamp: day1Timestamp,
      });
    }

    // 6th attempt on Day 1 is blocked
    expect(
      claimPostReward(recipientWallet, {
        contract: mockContract,
        adminDb: mockDb,
        timestamp: day1Timestamp,
      })
    ).rejects.toThrow(DailyCapExceededError);

    // On Day 2, mint succeeds again
    const nextDayRes = await claimPostReward(recipientWallet, {
      contract: mockContract,
      adminDb: mockDb,
      timestamp: day2Timestamp,
    });

    expect(nextDayRes.success).toBe(true);
    expect(nextDayRes.dayTotal).toBe(10);
    expect(mintCalls.length).toBe(6);
  });

  it("strictly isolates caps across distinct wallets", async () => {
    const secondWallet = ethers.Wallet.createRandom().address.toLowerCase();

    // Wallet A hits 50 EXPEN cap
    for (let i = 1; i <= 5; i++) {
      await claimPostReward(recipientWallet, {
        contract: mockContract,
        adminDb: mockDb,
      });
    }

    // Wallet B can still mint successfully
    const walletBResult = await claimPostReward(secondWallet, {
      contract: mockContract,
      adminDb: mockDb,
    });

    expect(walletBResult.success).toBe(true);
    expect(walletBResult.dayTotal).toBe(10);
    expect(walletBResult.recipient).toBe(secondWallet);
  });

  it("rejects invalid or empty wallet addresses", async () => {
    expect(
      claimPostReward("0x0000000000000000000000000000000000000000", {
        contract: mockContract,
      })
    ).rejects.toThrow(/Invalid recipient/);

    expect(
      claimPostReward("not-an-address", {
        contract: mockContract,
      })
    ).rejects.toThrow(/Invalid recipient/);
  });
});
