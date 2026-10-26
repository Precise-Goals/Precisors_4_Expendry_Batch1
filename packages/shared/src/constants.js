export const CHAIN_ID = 91562037;
export const RPC_URL = "https://testnetrpc.mstblockchain.com";
export const EXPLORER_URL = "https://testnet.mstscan.com";
export const TOKEN_DECIMALS = 18;
export const REWARD_PER_POST = 10;
export const DAILY_CAP = 50;

export const POST_TYPES = [
  "Experience",
  "Blueprint",
  "Idea",
  "Setup Tip",
  "Video Note",
];

export const NETWORK_CONFIG = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: "MST Testnet",
  nativeCurrency: {
    name: "MST",
    symbol: "MST",
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: [EXPLORER_URL],
};
