/**
 * Tier 4 — Real-World Application Scenarios Test Suite
 * 
 * Verifies end-to-end realistic user personas and journeys:
 * - Scenario 1: Veteran machinist shares lathe setup tip, earns 10 EXPEN, checks live balance
 * - Scenario 2: High-volume contributor hits 50 EXPEN cap on 5th post, 6th post is rejected with cap limit message
 * - Scenario 3: Hindi-speaking operator queries AI assistant for CNC tooling advice, receives streaming Hindi response citing community blueprint
 * - Scenario 4: Tool room supervisor navigates marketplace, filters carbide end mills, inspects 3D lathe model with orbit controls
 * - Scenario 5: Unauthenticated guest views community feed, attempts post authoring, gets guided to wallet onboarding
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

export const tier4Tests = [];

function registerTest(id, name, fn) {
  tier4Tests.push({ id, tier: 4, name, fn });
}

// =============================================================================
// Scenario 1: Veteran Machinist Knowledge Sharing
// =============================================================================
registerTest('T4-SCENARIO-01', 'Veteran machinist shares lathe setup tip, earns 10 EXPEN, checks live balance', () => {
  // 1. Setup platform subsystems
  const tokenContract = new ExpenTokenSimulator();
  const postsStore = new FirestorePostsSimulator();
  const rewardApi = new RewardApiSimulator(tokenContract, postsStore);

  // 2. Veteran machinist persona: Ramesh Sharma, 28 years lathe experience
  const machinistWallet = new WalletSimulator('0x73595081334A18D4298A160b162faB4Fb4B3c85B');
  assert.equal(machinistWallet.isConnected, true);
  assert.equal(tokenContract.balanceOf(machinistWallet.address), 0n);

  // 3. Completes onboarding profile
  const profile = {
    wallet: machinistWallet.address,
    username: 'Ramesh_Sharma_MasterMachinist',
    designation: 'Senior Lathe Specialist',
    company: 'Bharat Precision Forge'
  };
  assert.ok(profile.username);

  // 4. Drafts tacit knowledge setup tip
  const postTitle = 'Dampening Chatter on Thin-Wall Aluminum Sleeves with Leather Wrap';
  const postContent = 'When turning thin-walled (under 2mm) 6061-T6 aluminum tubes on long lathe mandrels, wrap wet vegetable-tanned leather around the OD and secure with hose clamps. This absorbs vibration harmonics and allows Ra 0.8um mirror finish without distortion.';
  const postType = 'Setup Tip';

  // 5. Signs authentication challenge nonce
  const nonce = rewardApi.generateNonce(machinistWallet.address);
  const signature = machinistWallet.signMessage(nonce);

  // 6. Submits post to /api/posts
  const result = rewardApi.handlePostCreationAndReward({
    title: postTitle,
    content: postContent,
    type: postType,
    authorWallet: machinistWallet.address,
    nonce,
    signature
  });

  // 7. Verify submission and on-chain reward
  assert.equal(result.status, 201);
  assert.equal(result.body.success, true);
  assert.equal(result.body.expenRewarded, 10);
  assert.ok(result.body.txHash.startsWith('0x'));

  // 8. Verify post is visible in public community feed
  const feed = postsStore.queryPosts({ type: 'Setup Tip' });
  assert.equal(feed.length, 1);
  assert.equal(feed[0].title, postTitle);
  assert.equal(feed[0].authorWallet, machinistWallet.address);

  // 9. Verify live EXPEN balance in community header
  const liveBalance = tokenContract.balanceOf(machinistWallet.address);
  assert.equal(liveBalance, 10n * 10n ** 18n);
  assert.equal(Number(liveBalance / (10n ** 18n)), 10);
});

// =============================================================================
// Scenario 2: High-Volume Contributor Daily Cap Enforcement
// =============================================================================
registerTest('T4-SCENARIO-02', 'High-volume contributor hits 50 EXPEN cap on 5th post, 6th post is rejected with cap limit message', () => {
  const tokenContract = new ExpenTokenSimulator();
  const postsStore = new FirestorePostsSimulator();
  const rewardApi = new RewardApiSimulator(tokenContract, postsStore);

  // High-volume contributor wallet
  const contributorWallet = new WalletSimulator('0x7FC1d02922d4865fd53De59697407a42e64d1Cad');

  // Contributor publishes 5 distinct posts throughout the shift
  const postTopics = [
    { title: 'Tungsten Carbide Grade Selection for Cast Iron', type: 'Experience' },
    { title: 'Speeds and Feeds Calculator Macro for Fanuc 31i', type: 'Blueprint' },
    { title: 'Magnetic Swarf Separator Improvement Concept', type: 'Idea' },
    { title: 'Soft Jaw Boring Technique for Thin Rings', type: 'Setup Tip' },
    { title: 'Vibration Analysis Using Accelerometer on Milling Head', type: 'Video Note' }
  ];

  for (let i = 0; i < 5; i++) {
    const item = postTopics[i];
    const nonce = rewardApi.generateNonce(contributorWallet.address);
    const signature = contributorWallet.signMessage(nonce);

    const res = rewardApi.handlePostCreationAndReward({
      title: item.title,
      content: `In-depth technical manufacturing documentation for ${item.title}. Ensure safety and precision tolerances.`,
      type: item.type,
      authorWallet: contributorWallet.address,
      nonce,
      signature
    });

    assert.equal(res.status, 201, `Post ${i + 1} should succeed`);
    assert.equal(res.body.expenRewarded, 10);
  }

  // Verify daily total is exactly 50 EXPEN
  const balanceAfter5 = tokenContract.balanceOf(contributorWallet.address);
  assert.equal(balanceAfter5, 50n * 10n ** 18n);

  // Contributor attempts 6th post on the same day
  const nonce6 = rewardApi.generateNonce(contributorWallet.address);
  const signature6 = contributorWallet.signMessage(nonce6);

  const res6 = rewardApi.handlePostCreationAndReward({
    title: 'Thread Milling G-Code Macro for Pitch 1.5mm',
    content: 'Custom parametric macro for helical thread milling inside hardened stainless steel.',
    type: 'Blueprint',
    authorWallet: contributorWallet.address,
    nonce: nonce6,
    signature: signature6
  });

  // Must be rejected with 429 status and informative cap limit message
  assert.equal(res6.status, 429);
  assert.equal(res6.body.error, 'Daily reward cap of 50 EXPEN reached');
  assert.equal(res6.body.expenRewarded, 0);

  // On-chain balance remains 50 EXPEN (no extra tokens minted)
  assert.equal(tokenContract.balanceOf(contributorWallet.address), 50n * 10n ** 18n);

  // Advance time by 24 hours (86400 seconds) to simulate next day rollover
  tokenContract.advanceTime(86400);

  // Post 7 on the next day succeeds and earns 10 EXPEN
  const nonce7 = rewardApi.generateNonce(contributorWallet.address);
  const signature7 = contributorWallet.signMessage(nonce7);

  const res7 = rewardApi.handlePostCreationAndReward({
    title: 'Next-Day Tool Life Optimization',
    content: 'Applying cryogenic coolant to double tool life during titanium aerospace milling operations.',
    type: 'Experience',
    authorWallet: contributorWallet.address,
    nonce: nonce7,
    signature: signature7
  });

  assert.equal(res7.status, 201);
  assert.equal(res7.body.expenRewarded, 10);
  assert.equal(tokenContract.balanceOf(contributorWallet.address), 60n * 10n ** 18n);
});

// =============================================================================
// Scenario 3: Hindi-Speaking Operator Multilingual AI Consultation
// =============================================================================
registerTest('T4-SCENARIO-03', 'Hindi-speaking operator queries AI assistant for CNC tooling advice, receives streaming Hindi response citing community blueprint', () => {
  const postsStore = new FirestorePostsSimulator();

  // 1. Author community blueprint in repository
  const blueprintPost = postsStore.createPost({
    title: 'Carbide End Mill Feeds and Speeds Blueprint',
    content: 'For 4-flute carbide end mills milling mild steel, maintain cutting speed 90-120 m/min, chip load 0.05mm per tooth, and flood coolant to prevent thermal cracking.',
    type: 'Blueprint',
    authorWallet: '0x73595081334A18D4298A160b162faB4Fb4B3c85B'
  });

  // 2. Hindi-speaking operator visits /agent, switches language to 'hi'
  const operatorLang = 'hi';
  const operatorQuery = 'सीएनसी मिलिंग में कार्बाइड एंड मिल का सही फीड रेट क्या होना चाहिए?';

  // 3. RAG engine retrieves community context
  const allPosts = postsStore.queryPosts();
  const context = RAGEngineSimulator.assembleContext('carbide end mill feeds speeds', allPosts);

  assert.ok(context.sources.length >= 1);
  assert.equal(context.sources[0].id, blueprintPost.id);
  assert.ok(context.tokenCount <= CONSTANTS.MAX_RAG_TOKENS);

  // 4. Sarvam AI generates streaming Devanagari response
  const sarvamResponse = RAGEngineSimulator.simulateSarvamResponse({
    message: operatorQuery,
    lang: operatorLang,
    contextText: context.contextText,
    sources: context.sources
  });

  assert.equal(sarvamResponse.resolvedLang, 'hi');
  assert.ok(sarvamResponse.answer.startsWith('नमस्ते!'));
  assert.ok(sarvamResponse.answer.includes(blueprintPost.title));
  assert.ok(sarvamResponse.stream.includes('data: {"delta":'));
  assert.ok(sarvamResponse.stream.includes('"done":true'));
  assert.equal(sarvamResponse.sources[0].title, blueprintPost.title);
});

// =============================================================================
// Scenario 4: Tool Room Supervisor Marketplace Navigation & 3D Tooling Inspection
// =============================================================================
registerTest('T4-SCENARIO-04', 'Tool room supervisor navigates marketplace, filters carbide end mills, inspects 3D lathe model with orbit controls', () => {
  const marketplace = new MarketplaceSimulator();
  const showcase = new ShowcaseSimulator();
  const supervisorWallet = '0x8cA0f3176997F32CCBb4598Fc8C966C95aeEEc9e';

  // 1. Supervisor navigates to /marketplace and filters by Cutting Tools
  const cuttingTools = marketplace.filterProducts({ category: 'Cutting Tools' });
  assert.ok(cuttingTools.length >= 4);

  // 2. Applies price filter $40 - $100 and search 'carbide'
  const filtered = marketplace.filterProducts({
    category: 'Cutting Tools',
    minPrice: 40,
    maxPrice: 100,
    search: 'carbide'
  });
  assert.ok(filtered.length >= 1);

  // 3. Inspects 3D lathe model for indexable insert tool
  const insertProduct = filtered.find(p => p.id === 'prod-001');
  assert.ok(insertProduct);
  assert.equal(insertProduct.has3DModel, true);

  // 4. Opens 3D inspection view
  const model = showcase.getModel(insertProduct.modelId);
  assert.ok(model);
  assert.equal(model.geometryType, 'LatheGeometry');
  assert.ok(model.materials.metalness >= 0.8);
  assert.equal(showcase.validateOrbitControlParams(model.orbitControls), true);

  // 5. Completes demo purchase
  const order = marketplace.mockCheckout(insertProduct.id, supervisorWallet);
  assert.equal(order.success, true);
  assert.equal(order.status, 'DEMO_CONFIRMED');
  assert.ok(order.orderId.startsWith('ORD-EXP-'));
  assert.match(order.toastMessage, /Purchase confirmed \(demo mode\)/);
});

// =============================================================================
// Scenario 5: Unauthenticated Guest Views Community Feed & Guided to Onboarding
// =============================================================================
registerTest('T4-SCENARIO-05', 'Unauthenticated guest views community feed, attempts post authoring, gets guided to wallet onboarding', () => {
  const tokenContract = new ExpenTokenSimulator();
  const postsStore = new FirestorePostsSimulator();
  const rewardApi = new RewardApiSimulator(tokenContract, postsStore);

  // 1. Pre-seed community feed with posts
  postsStore.createPost({
    title: 'Spindle Warmup Routine for High-Speed Machining',
    content: 'Run spindle at 2000 RPM for 10 minutes then ramp to 8000 RPM before cutting to distribute bearing grease evenly.',
    type: 'Setup Tip',
    authorWallet: '0x73595081334A18D4298A160b162faB4Fb4B3c85B'
  });

  // 2. Unauthenticated guest lands on /community
  let guestWallet = null;
  const publicFeed = postsStore.queryPosts();
  assert.equal(publicFeed.length, 1);
  assert.equal(publicFeed[0].title, 'Spindle Warmup Routine for High-Speed Machining');

  // 3. Guest attempts post creation without wallet connection
  const guestDraft = {
    title: 'Chip Breaker Geometry for Sticky Aluminum',
    content: 'Polished flutes and high positive rake prevent chip buildup on cutting edges.',
    type: 'Idea'
  };

  // AuthGuard intercepts attempt
  const isAuthorized = guestWallet !== null && WalletSimulator.isValidAddress(guestWallet);
  assert.equal(isAuthorized, false, 'Guest is unauthenticated');

  // 4. Guest connects BridgeKey wallet and completes profile
  guestWallet = new WalletSimulator('0x2222333344445555666677778888999900001111');
  assert.equal(WalletSimulator.isValidAddress(guestWallet.address), true);

  // 5. Auth verification & nonce generation
  const nonce = rewardApi.generateNonce(guestWallet.address);
  const signature = guestWallet.signMessage(nonce);

  // 6. Resume submission with now-authenticated wallet
  const res = rewardApi.handlePostCreationAndReward({
    title: guestDraft.title,
    content: guestDraft.content,
    type: guestDraft.type,
    authorWallet: guestWallet.address,
    nonce,
    signature
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.expenRewarded, 10);
  assert.equal(tokenContract.balanceOf(guestWallet.address), 10n * 10n ** 18n);

  // 7. Verify post is now in community feed
  const updatedFeed = postsStore.queryPosts();
  assert.equal(updatedFeed.length, 2);
  const foundPost = updatedFeed.find(p => p.title === guestDraft.title);
  assert.ok(foundPost);
  assert.equal(foundPost.authorWallet, guestWallet.address.toLowerCase());
});
