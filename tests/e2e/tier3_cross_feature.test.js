/**
 * Tier 3 — Cross-Feature Interactions Test Suite
 * 
 * Verifies complex multi-step workflows that span across multiple subsystems:
 * - Flow 1: Wallet Connect -> Onboard Profile -> Create Post -> EXPEN Mint -> Live Balance
 * - Flow 2: Create Post -> Chunker -> BM25 Index -> Agent Prompt Context -> Sarvam Response
 * - Flow 3: Marketplace Catalog -> Select Tool -> View in 3D Showcase -> Demo Checkout
 * - Flow 4: Expired Auth Session -> Post Intercept -> Re-Auth -> Resume & Mint
 * - Flow 5: Cross-Lingual RAG: English Tacit Post -> Devanagari Hindi Sarvam Response
 */

import assert from 'node:assert/strict';
import {
  CONSTANTS,
  WalletSimulator,
  ExpenTokenSimulator,
  FirestorePostsSimulator,
  RewardApiSimulator,
  RAGEngineSimulator,
  MarketplaceSimulator,
  ShowcaseSimulator
} from './fixtures/engine.js';

export const tier3Tests = [];

function registerTest(id, name, fn) {
  tier3Tests.push({ id, tier: 3, name, fn });
}

registerTest('T3-FLOW-01', 'Wallet Connect -> Onboard Profile -> Create Post -> EXPEN Mint -> Live Balance', () => {
  // Step 1: Wallet Connection & Validation
  const userWallet = new WalletSimulator('0x73595081334A18D4298A160b162faB4Fb4B3c85B');
  assert.equal(userWallet.isConnected, true);
  assert.equal(userWallet.chainId, CONSTANTS.CHAIN_ID_HEX);
  const formattedAddr = WalletSimulator.formatAddress(userWallet.address);
  assert.equal(formattedAddr, '0x7359...c85b');

  // Step 2: Profile Setup
  const userProfile = {
    wallet: userWallet.address,
    username: 'TurnMasterRamesh',
    designation: 'Master Lathe Machinist',
    company: 'Bharat Precision Gears',
    onboardedAt: Date.now()
  };
  assert.ok(userProfile.username.length >= 3);
  assert.ok(userProfile.designation.length >= 3);

  // Step 3 & 4: Subsystem Setup & Initial Balance Check
  const tokenContract = new ExpenTokenSimulator();
  const postsStore = new FirestorePostsSimulator();
  const rewardApi = new RewardApiSimulator(tokenContract, postsStore);

  assert.equal(tokenContract.balanceOf(userWallet.address), 0n, 'Initial balance must be 0 EXPEN');

  // Step 5: User composes post and signs nonce
  const nonce = rewardApi.generateNonce(userWallet.address);
  const signature = userWallet.signMessage(nonce);

  const postPayload = {
    title: 'Four-Jaw Chuck Trueing with Dial Indicator',
    content: 'Always mark the high spot and adjust opposing jaws in pairs to achieve workpiece concentricity under 0.005mm.',
    type: 'Setup Tip',
    authorWallet: userWallet.address,
    nonce,
    signature
  };

  // Step 6: Post Submission & Reward Processing
  const response = rewardApi.handlePostCreationAndReward(postPayload);

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.expenRewarded, 10);
  assert.ok(response.body.txHash.startsWith('0x'));

  // Step 7: Verify Firestore Document State
  const savedDoc = postsStore.getPost(response.body.postId);
  assert.ok(savedDoc);
  assert.equal(savedDoc.rewarded, true);
  assert.equal(savedDoc.txHash, response.body.txHash);
  assert.equal(savedDoc.authorWallet, userWallet.address);

  // Step 8: Live Balance Reflection
  const liveBalance = tokenContract.balanceOf(userWallet.address);
  assert.equal(liveBalance, 10n * 10n ** 18n, 'Live balance must reflect 10 EXPEN minted on MST Testnet');
  assert.equal(Number(liveBalance / (10n ** 18n)), 10);
});

registerTest('T3-FLOW-02', 'Create Post -> Chunker -> BM25 Index -> Agent Prompt Context -> Sarvam Response', () => {
  // Step 1: Create technical blueprint post
  const postsStore = new FirestorePostsSimulator();
  const authorWallet = '0x7FC1d02922d4865fd53De59697407a42e64d1Cad';

  const blueprintPost = postsStore.createPost({
    title: 'Speeds and Feeds for Aerospace Titanium Ti-6Al-4V Milling',
    content: 'Milling grade 5 titanium requires rigid machine setup, solid carbide end mills with 35 degree helix, surface speed 35 m/min, and 0.04mm feed per tooth with high pressure emulsion coolant to prevent work hardening.',
    type: 'Blueprint',
    authorWallet
  });

  assert.ok(blueprintPost.id);

  // Step 2: Semantic Chunking & BM25 Scoring
  const postsList = postsStore.queryPosts();
  const userQuery = 'What is the recommended surface speed and coolant for titanium milling?';

  const contextData = RAGEngineSimulator.assembleContext(userQuery, postsList, 5);

  assert.ok(contextData.sources.length >= 1);
  assert.equal(contextData.sources[0].id, blueprintPost.id);
  assert.equal(contextData.sources[0].type, 'Blueprint');
  assert.ok(contextData.contextText.includes('Titanium Ti-6Al-4V'));
  assert.ok(contextData.tokenCount <= CONSTANTS.MAX_RAG_TOKENS);

  // Step 3: Sarvam AI Streaming Pipeline
  const sarvamResponse = RAGEngineSimulator.simulateSarvamResponse({
    message: userQuery,
    lang: 'en',
    contextText: contextData.contextText,
    sources: contextData.sources
  });

  assert.equal(sarvamResponse.resolvedLang, 'en');
  assert.ok(sarvamResponse.answer.includes(blueprintPost.title));
  assert.ok(sarvamResponse.stream.includes('data: {"delta":'));
  assert.ok(sarvamResponse.stream.includes('"done":true'));
  assert.equal(sarvamResponse.sources[0].id, blueprintPost.id);
});

registerTest('T3-FLOW-03', 'Marketplace Catalog Search & Category Filter -> Tool Selection -> 3D Interactive Inspection -> Demo Checkout', () => {
  const marketplace = new MarketplaceSimulator();
  const showcase = new ShowcaseSimulator();
  const buyerWallet = '0x8cA0f3176997F32CCBb4598Fc8C966C95aeEEc9e';

  // Step 1: Filter catalog by Cutting Tools and search term
  const searchResults = marketplace.filterProducts({
    category: 'Cutting Tools',
    search: 'carbide end mill'
  });

  assert.ok(searchResults.length >= 1);
  const selectedProduct = searchResults.find(p => p.id === 'prod-002');
  assert.ok(selectedProduct);
  assert.equal(selectedProduct.id, 'prod-002');
  assert.equal(selectedProduct.has3DModel, true);
  assert.equal(selectedProduct.modelId, 'drill-bit');

  // Step 2: Inspect in 3D Showcase
  const modelMetadata = showcase.getModel(selectedProduct.modelId);
  assert.ok(modelMetadata);
  assert.equal(modelMetadata.geometryType, 'CylinderAndConeGeometry');
  assert.ok(modelMetadata.materials.metalness >= 0.8);
  assert.equal(showcase.validateOrbitControlParams(modelMetadata.orbitControls), true);

  // Step 3: Execute Demo Checkout
  const checkoutResult = marketplace.mockCheckout(selectedProduct.id, buyerWallet);
  assert.equal(checkoutResult.success, true);
  assert.equal(checkoutResult.productId, 'prod-002');
  assert.equal(checkoutResult.buyerWallet, buyerWallet.toLowerCase());
  assert.equal(checkoutResult.status, 'DEMO_CONFIRMED');
  assert.match(checkoutResult.toastMessage, /Purchase confirmed \(demo mode\)/);
});

registerTest('T3-FLOW-04', 'Auth Session Intercept -> Nonce Re-sign -> Post Creation Resume', () => {
  const tokenContract = new ExpenTokenSimulator();
  const postsStore = new FirestorePostsSimulator();
  const rewardApi = new RewardApiSimulator(tokenContract, postsStore);
  const wallet = new WalletSimulator('0x73595081334A18D4298A160b162faB4Fb4B3c85B');

  // Initial attempt with invalid/stale nonce
  const staleNonce = 'expired-session-nonce-12345';
  const staleSignature = wallet.signMessage(staleNonce);

  const initialAttempt = rewardApi.handlePostCreationAndReward({
    title: 'Grinding Wheel Dressing Frequency',
    content: 'Dress vitrified grinding wheels every 15 passes to remove glazed abrasive grains and restore sharp cutting edges.',
    type: 'Setup Tip',
    authorWallet: wallet.address,
    nonce: staleNonce,
    signature: staleSignature
  });

  assert.equal(initialAttempt.status, 401, 'Stale nonce must be rejected with 401');

  // AuthGuard intercepts and issues fresh challenge
  const freshNonce = rewardApi.generateNonce(wallet.address);
  const freshSignature = wallet.signMessage(freshNonce);

  // Resubmit with valid credentials
  const resumeAttempt = rewardApi.handlePostCreationAndReward({
    title: 'Grinding Wheel Dressing Frequency',
    content: 'Dress vitrified grinding wheels every 15 passes to remove glazed abrasive grains and restore sharp cutting edges.',
    type: 'Setup Tip',
    authorWallet: wallet.address,
    nonce: freshNonce,
    signature: freshSignature
  });

  assert.equal(resumeAttempt.status, 201);
  assert.equal(resumeAttempt.body.success, true);
  assert.equal(resumeAttempt.body.expenRewarded, 10);
  assert.equal(tokenContract.balanceOf(wallet.address), 10n * 10n ** 18n);
});

registerTest('T3-FLOW-05', 'Cross-Lingual RAG: English Tacit Post -> Devanagari Hindi Sarvam Streaming Output', () => {
  const postsStore = new FirestorePostsSimulator();
  const authorWallet = '0x73595081334A18D4298A160b162faB4Fb4B3c85B';

  // Senior machinist shares tacit advice in English
  const post = postsStore.createPost({
    title: 'Anti-Vibration Dampening for Long Boring Bars',
    content: 'Tuned mass dampeners inside boring bars with length-to-diameter ratio above 4:1 eliminate chatter harmonics during internal threading.',
    type: 'Blueprint',
    authorWallet
  });

  // Hindi operator queries in Hindi
  const hindiQuery = 'बोरिंग बार में कंपन कैसे रोकें?';
  const allPosts = postsStore.queryPosts();

  // Keyword match fallback / context assembly
  const context = RAGEngineSimulator.assembleContext('boring bars vibration chatter dampeners', allPosts);

  assert.ok(context.sources.length >= 1);
  assert.equal(context.sources[0].id, post.id);

  // Sarvam AI generates streaming Hindi output
  const sarvamHindi = RAGEngineSimulator.simulateSarvamResponse({
    message: hindiQuery,
    lang: 'hi',
    contextText: context.contextText,
    sources: context.sources
  });

  assert.equal(sarvamHindi.resolvedLang, 'hi');
  assert.ok(sarvamHindi.answer.includes('नमस्ते!'));
  assert.ok(sarvamHindi.answer.includes(post.title));
  assert.ok(sarvamHindi.stream.includes('data: {"delta":'));
});
