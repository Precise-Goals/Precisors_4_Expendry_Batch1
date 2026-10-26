/**
 * Expendry Opaque-Box E2E Testing Engine & Contract Fixtures
 * 
 * Authoritative contracts derived from:
 * - ORIGINAL_REQUEST.md (R1-R5, Acceptance Criteria)
 * - PROJECT.md (Interface Contracts, Milestones, Architecture)
 */

import crypto from 'node:crypto';

export const CONSTANTS = {
  CHAIN_ID: 91562037,
  CHAIN_ID_HEX: '0x5752035',
  RPC_URL: 'https://testnetrpc.mstblockchain.com',
  EXPLORER_URL: 'https://testnet.mstscan.com',
  TOKEN_NAME: 'Expendry Token',
  TOKEN_SYMBOL: 'EXPEN',
  TOKEN_DECIMALS: 18,
  DAILY_CAP_EXPEN: 50,
  REWARD_PER_POST_EXPEN: 10,
  DAILY_CAP_WEI: 50n * 10n ** 18n,
  REWARD_PER_POST_WEI: 10n * 10n ** 18n,
  OPERATOR_ADDRESS: '0x73595081334A18D4298A160b162faB4Fb4B3c85B',
  AUTHORIZED_WALLETS: [
    '0x73595081334A18D4298A160b162faB4Fb4B3c85B',
    '0x7FC1d02922d4865fd53De59697407a42e64d1Cad',
    '0x8cA0f3176997F32CCBb4598Fc8C966C95aeEEc9e'
  ],
  POST_TYPES: ['Experience', 'Blueprint', 'Idea', 'Setup Tip', 'Video Note'],
  CORE_ROUTES: [
    { path: '/', name: 'Home', title: 'Expendry - Manufacturing Tacit Knowledge' },
    { path: '/community', name: 'Community', title: 'Community Feed' },
    { path: '/onboarding', name: 'Onboarding', title: 'BridgeKey Wallet Onboarding' },
    { path: '/agent', name: 'Agent', title: 'Sarvam AI Machining Assistant' },
    { path: '/marketplace', name: 'Marketplace', title: 'Tooling Marketplace & 3D Showcase' }
  ],
  SUPPORTED_LANGUAGES: ['en', 'hi', 'mr'],
  DEFAULT_LANGUAGE: 'en',
  MAX_RAG_TOKENS: 1500,
  SARVAM_MODEL: 'sarvam-105b-conversations'
};

/**
 * Wallet & Cryptographic Verification Simulation
 */
export class WalletSimulator {
  constructor(address = '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9012') {
    this.address = address.toLowerCase();
    this.chainId = CONSTANTS.CHAIN_ID_HEX;
    this.isConnected = true;
    this.listeners = new Map();
  }

  static isValidAddress(address) {
    if (typeof address !== 'string') return false;
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
    if (address.toLowerCase() === '0x0000000000000000000000000000000000000000') return false;
    return true;
  }

  static formatAddress(address) {
    if (!this.isValidAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`);
    }
    const clean = address.toLowerCase();
    return `${clean.slice(0, 6)}...${clean.slice(-4)}`;
  }

  signMessage(message) {
    const hash = crypto.createHmac('sha256', 'mst-wallet-secret-seed')
      .update(`${this.address}:${message}`)
      .digest('hex');
    return `0x${hash}`;
  }

  static verifySignature(address, message, signature) {
    if (!this.isValidAddress(address)) return false;
    if (!signature || !signature.startsWith('0x')) return false;
    const expected = `0x${crypto.createHmac('sha256', 'mst-wallet-secret-seed')
      .update(`${address.toLowerCase()}:${message}`)
      .digest('hex')}`;
    return expected.toLowerCase() === signature.toLowerCase();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, ...args) {
    const list = this.listeners.get(event) || [];
    for (const cb of list) {
      cb(...args);
    }
  }

  switchChain(targetChainIdHex) {
    if (targetChainIdHex !== CONSTANTS.CHAIN_ID_HEX) {
      throw new Error(`Unsupported chain ID: ${targetChainIdHex}. Expected ${CONSTANTS.CHAIN_ID_HEX}`);
    }
    this.chainId = targetChainIdHex;
    this.emit('chainChanged', targetChainIdHex);
    return true;
  }
}

/**
 * EXPEN ERC-20 Smart Contract & Daily Cap State Machine
 */
export class ExpenTokenSimulator {
  constructor(operator = CONSTANTS.OPERATOR_ADDRESS) {
    this.name = CONSTANTS.TOKEN_NAME;
    this.symbol = CONSTANTS.TOKEN_SYMBOL;
    this.decimals = CONSTANTS.TOKEN_DECIMALS;
    this.operator = operator.toLowerCase();
    this.isPaused = false;
    this.balances = new Map(); // address -> bigint
    this.dailyMinted = new Map(); // `${address}:${dateKey}` -> bigint
    this.currentTimeOffset = 0; // seconds offset for time travel
  }

  getDateKey(timestampMs = (Date.now() + this.currentTimeOffset * 1000)) {
    const d = new Date(timestampMs);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  balanceOf(address) {
    return this.balances.get(address.toLowerCase()) || 0n;
  }

  getDailyMinted(address, timestampMs) {
    const key = `${address.toLowerCase()}:${this.getDateKey(timestampMs)}`;
    return this.dailyMinted.get(key) || 0n;
  }

  pause(caller) {
    if (caller.toLowerCase() !== this.operator) {
      throw new Error('Ownable: caller is not the owner');
    }
    this.isPaused = true;
  }

  unpause(caller) {
    if (caller.toLowerCase() !== this.operator) {
      throw new Error('Ownable: caller is not the owner');
    }
    this.isPaused = false;
  }

  advanceTime(seconds) {
    this.currentTimeOffset += seconds;
  }

  mint(caller, recipient, amountWei, timestampMs) {
    if (this.isPaused) {
      throw new Error('EnforcedPause: token minting paused');
    }
    if (caller.toLowerCase() !== this.operator) {
      throw new Error('Ownable: caller is not the owner');
    }
    if (!WalletSimulator.isValidAddress(recipient)) {
      throw new Error('ERC20InvalidReceiver: zero or invalid recipient address');
    }
    if (amountWei <= 0n) {
      throw new Error('InvalidAmount: mint amount must be positive');
    }

    const rec = recipient.toLowerCase();
    const dateKey = this.getDateKey(timestampMs);
    const dayKey = `${rec}:${dateKey}`;
    const currentDayMint = this.dailyMinted.get(dayKey) || 0n;

    if (currentDayMint + amountWei > CONSTANTS.DAILY_CAP_WEI) {
      throw new Error(`DailyCapExceeded: current ${currentDayMint / (10n**18n)} EXPEN + requested ${amountWei / (10n**18n)} EXPEN exceeds daily cap of ${CONSTANTS.DAILY_CAP_EXPEN} EXPEN`);
    }

    // Update balances
    const currentBal = this.balances.get(rec) || 0n;
    this.balances.set(rec, currentBal + amountWei);
    this.dailyMinted.set(dayKey, currentDayMint + amountWei);

    const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
    return {
      success: true,
      recipient: rec,
      amountWei,
      newBalance: this.balances.get(rec),
      dayTotalWei: this.dailyMinted.get(dayKey),
      txHash
    };
  }
}

/**
 * Firestore Posts Collection Simulation
 */
export class FirestorePostsSimulator {
  constructor() {
    this.posts = new Map();
  }

  sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();
  }

  createPost({ title, content, type, authorWallet, createdAt = Date.now() }) {
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      throw new Error('ValidationError: Title must be at least 3 characters long');
    }
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      throw new Error('ValidationError: Content must be at least 10 characters long');
    }
    if (!CONSTANTS.POST_TYPES.includes(type)) {
      throw new Error(`ValidationError: Invalid post type '${type}'. Allowed: ${CONSTANTS.POST_TYPES.join(', ')}`);
    }
    if (!WalletSimulator.isValidAddress(authorWallet)) {
      throw new Error('ValidationError: Invalid or missing author wallet');
    }

    const id = `post_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const cleanTitle = this.sanitize(title);
    const cleanContent = this.sanitize(content);

    const postDoc = {
      id,
      title: cleanTitle,
      content: cleanContent,
      type,
      authorWallet: authorWallet.toLowerCase(),
      createdAt,
      rewarded: false,
      txHash: null
    };

    this.posts.set(id, postDoc);
    return postDoc;
  }

  getPost(id) {
    return this.posts.get(id) || null;
  }

  queryPosts({ type, limit = 20 } = {}) {
    let list = Array.from(this.posts.values());
    if (type && type !== 'All') {
      list = list.filter(p => p.type === type);
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    return list.slice(0, limit);
  }
}

/**
 * Server-Side Reward API Simulator
 */
export class RewardApiSimulator {
  constructor(tokenContract, postsStore) {
    this.tokenContract = tokenContract;
    this.postsStore = postsStore;
    this.nonces = new Set();
  }

  generateNonce(wallet) {
    const nonce = `expendry-auth-${wallet.toLowerCase()}-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    this.nonces.add(nonce);
    return nonce;
  }

  handlePostCreationAndReward({ title, content, type, authorWallet, nonce, signature }) {
    // 1. Verify Nonce & Signature
    if (!this.nonces.has(nonce)) {
      return { status: 401, body: { error: 'Invalid or replayed nonce' } };
    }
    this.nonces.delete(nonce); // prevent replay

    if (!WalletSimulator.verifySignature(authorWallet, nonce, signature)) {
      return { status: 401, body: { error: 'Invalid wallet signature' } };
    }

    // 2. Validate input and save post
    let post;
    try {
      post = this.postsStore.createPost({ title, content, type, authorWallet });
    } catch (err) {
      return { status: 400, body: { error: err.message } };
    }

    // 3. Evaluate Daily Cap
    const currentMint = this.tokenContract.getDailyMinted(authorWallet);
    if (currentMint + CONSTANTS.REWARD_PER_POST_WEI > CONSTANTS.DAILY_CAP_WEI) {
      return {
        status: 429,
        body: {
          error: 'Daily reward cap of 50 EXPEN reached',
          postId: post.id,
          expenRewarded: 0,
          currentDayTotal: Number(currentMint / (10n ** 18n))
        }
      };
    }

    // 4. Operator Mints 10 EXPEN on MST Testnet
    const mintRes = this.tokenContract.mint(
      CONSTANTS.OPERATOR_ADDRESS,
      authorWallet,
      CONSTANTS.REWARD_PER_POST_WEI
    );

    post.rewarded = true;
    post.txHash = mintRes.txHash;

    return {
      status: 201,
      body: {
        success: true,
        postId: post.id,
        txHash: mintRes.txHash,
        expenRewarded: 10,
        newBalance: Number(mintRes.newBalance / (10n ** 18n))
      }
    };
  }
}

/**
 * BM25-lite Semantic Chunker & Sarvam AI RAG Simulator
 */
export class RAGEngineSimulator {
  static estimateTokens(text) {
    if (!text) return 0;
    // Approximates token count (~4 characters per token in English, ~2 in Devanagari)
    return Math.ceil(text.length / 3.5);
  }

  static chunkText(text, maxChunkTokens = 150) {
    const sentences = text.split(/(?<=[.?!।])\s+/);
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
      if (this.estimateTokens(current + ' ' + sentence) > maxChunkTokens && current) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current = current ? `${current} ${sentence}` : sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  static scoreBM25Lite(query, chunk) {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const chunkLower = chunk.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      const occurrences = (chunkLower.match(new RegExp(term, 'g')) || []).length;
      if (occurrences > 0) {
        // BM25 term frequency saturation
        score += (occurrences * 2.2) / (occurrences + 1.2);
      }
    }
    return score;
  }

  static assembleContext(query, posts, k = 5, maxTokens = CONSTANTS.MAX_RAG_TOKENS) {
    const scoredChunks = [];

    for (const post of posts) {
      const typeWeight = post.type === 'Blueprint' ? 1.5 : (post.type === 'Setup Tip' ? 1.3 : 1.0);
      const chunks = this.chunkText(`${post.title}. ${post.content}`);

      for (const chunk of chunks) {
        const rawScore = this.scoreBM25Lite(query, chunk);
        if (rawScore > 0) {
          scoredChunks.push({
            postId: post.id,
            postTitle: post.title,
            postType: post.type,
            chunk,
            score: rawScore * typeWeight
          });
        }
      }
    }

    scoredChunks.sort((a, b) => b.score - a.score);
    const selected = scoredChunks.slice(0, k);

    let contextText = '';
    const sources = [];
    let currentTokens = 0;

    for (const item of selected) {
      const snippet = `[Source: ${item.postTitle} (${item.postType})]: ${item.chunk}\n`;
      const itemTokens = this.estimateTokens(snippet);
      if (currentTokens + itemTokens > maxTokens) break;

      contextText += snippet;
      currentTokens += itemTokens;
      if (!sources.find(s => s.id === item.postId)) {
        sources.push({ id: item.postId, title: item.postTitle, type: item.postType });
      }
    }

    return {
      contextText: contextText.trim(),
      sources,
      tokenCount: this.estimateTokens(contextText)
    };
  }

  static resolveLanguage(lang) {
    if (!lang || !CONSTANTS.SUPPORTED_LANGUAGES.includes(lang.toLowerCase())) {
      return CONSTANTS.DEFAULT_LANGUAGE;
    }
    return lang.toLowerCase();
  }

  static simulateSarvamResponse({ message, lang, contextText, sources }) {
    const resolvedLang = this.resolveLanguage(lang);

    let answer = '';
    if (resolvedLang === 'hi') {
      answer = `नमस्ते! एक्सपेंड्री ज्ञानकोश के अनुसार, आपके प्रश्न "${message}" का उत्तर: मशीनिंग सेटअप में सही फीड रेट और कूलेंट फ्लो बनाए रखना अनिवार्य है।`;
      if (sources.length > 0) {
        answer += ` (संदर्भ: ${sources[0].title})`;
      }
    } else if (resolvedLang === 'mr') {
      answer = `नमस्कार! एक्सपेंड्री ज्ञानानुसार, तुमच्या "${message}" या प्रश्नाचे उत्तर: मशीनिंग अचूकतेसाठी टूल रनआउट तपासणे अत्यंत आवश्यक आहे.`;
      if (sources.length > 0) {
        answer += ` (संदर्भ: ${sources[0].title})`;
      }
    } else {
      answer = `Based on Expendry community tacit knowledge, regarding "${message}": optimal feeds, rigid workholding, and vibration dampening ensure superior surface finish.`;
      if (sources.length > 0) {
        answer += ` (Referenced from: ${sources[0].title})`;
      }
    }

    // Build Server-Sent Events (SSE) stream simulation
    const streamChunks = [];
    const words = answer.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const textPiece = words.slice(i, i + 3).join(' ') + ' ';
      streamChunks.push(`data: ${JSON.stringify({ delta: textPiece, done: false })}\n\n`);
    }
    streamChunks.push(`data: ${JSON.stringify({ delta: '', done: true, sources })}\n\n`);

    return {
      answer,
      resolvedLang,
      sources,
      stream: streamChunks.join('')
    };
  }
}

/**
 * Tooling Marketplace Catalog & Filter Engine
 */
export const MARKETPLACE_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'CNC Indexable Carbide Turning Insert Set (10-Pack)',
    category: 'Cutting Tools',
    price: 48.50,
    specs: { grade: 'TiN Coated Carbide', insertType: 'CNMG 432', rake: 'Negative' },
    has3DModel: true,
    modelId: 'lathe-body'
  },
  {
    id: 'prod-002',
    name: '4-Flute Solid Carbide End Mill Ø12mm AlTiN',
    category: 'Cutting Tools',
    price: 78.00,
    specs: { diameter: '12mm', fluteCount: 4, coating: 'AlTiN', hardness: 'HRC 55' },
    has3DModel: true,
    modelId: 'drill-bit'
  },
  {
    id: 'prod-003',
    name: 'Digital Vernier Caliper 0-150mm IP67 Coolant Proof',
    category: 'Measuring Instruments',
    price: 125.00,
    specs: { range: '0-150mm', resolution: '0.01mm', protection: 'IP67' },
    has3DModel: false,
    modelId: null
  },
  {
    id: 'prod-004',
    name: 'HSS-Co M35 Cobalt Drill Bit Set (1-13mm)',
    category: 'Cutting Tools',
    price: 64.90,
    specs: { material: 'M35 5% Cobalt HSS', pointAngle: '135 deg split point' },
    has3DModel: true,
    modelId: 'drill-bit'
  },
  {
    id: 'prod-005',
    name: 'Precision Modular CNC Milling Vise 150mm',
    category: 'Workholding',
    price: 345.00,
    specs: { jawWidth: '150mm', maxOpening: '200mm', clampingForce: '35 kN' },
    has3DModel: false,
    modelId: null
  },
  {
    id: 'prod-006',
    name: 'Indexable Boring Bar Set 4-Piece (8mm to 16mm)',
    category: 'Cutting Tools',
    price: 155.00,
    specs: { shanks: '8mm, 10mm, 12mm, 16mm', direction: 'Right Hand' },
    has3DModel: true,
    modelId: 'lathe-body'
  },
  {
    id: 'prod-007',
    name: 'Modular High-Pressure Coolant Hose & Nozzle Kit',
    category: 'Tooling Accessories',
    price: 32.50,
    specs: { pressureRating: '50 PSI', thread: '1/4" NPT', segments: 16 },
    has3DModel: false,
    modelId: null
  },
  {
    id: 'prod-008',
    name: 'Magnetic Base Universal Dial Indicator Gauge 0.001mm',
    category: 'Measuring Instruments',
    price: 92.00,
    specs: { range: '0-10mm', resolution: '0.001mm', magneticHold: '60 kg' },
    has3DModel: false,
    modelId: null
  },
  {
    id: 'prod-009',
    name: 'Titanium-Nitride HSS Tap and Die Set M3-M12 (32-Piece)',
    category: 'Cutting Tools',
    price: 112.00,
    specs: { sizes: 'M3 to M12', coating: 'TiN Golden', case: 'Metal index' },
    has3DModel: false,
    modelId: null
  },
  {
    id: 'prod-010',
    name: 'ER32 Precision Collet Chuck Set (18-Piece ISO15448)',
    category: 'Workholding',
    price: 198.00,
    specs: { colletSize: 'ER32 (3-20mm)', runout: '< 0.005mm' },
    has3DModel: false,
    modelId: null
  }
];

export class MarketplaceSimulator {
  constructor(products = MARKETPLACE_PRODUCTS) {
    this.products = products;
  }

  filterProducts({ category, minPrice, maxPrice, search } = {}) {
    let list = [...this.products];

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    let min = (typeof minPrice === 'number' && !isNaN(minPrice)) ? minPrice : 0;
    let max = (typeof maxPrice === 'number' && !isNaN(maxPrice)) ? maxPrice : Infinity;

    // Handle inverted bounds gracefully
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    list = list.filter(p => p.price >= min && p.price <= max);

    if (search && typeof search === 'string') {
      const sanitized = search
        .replace(/<[^>]*>/g, '')
        .replace(/--.*$/g, '')
        .replace(/['";]/g, '')
        .trim();
      const keywords = sanitized.toLowerCase().split(/\s+/).filter(w => w.length >= 3 && !['and', 'or', '1=1', 'select', 'where'].includes(w));
      if (keywords.length > 0) {
        list = list.filter(p => {
          const text = `${p.name} ${p.category}`.toLowerCase();
          return keywords.some(k => text.includes(k));
        });
      }
    }

    return list;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id) || null;
  }

  mockCheckout(productId, buyerWallet) {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error(`ProductNotFound: No product found with ID ${productId}`);
    }
    if (!WalletSimulator.isValidAddress(buyerWallet)) {
      throw new Error('InvalidBuyerWallet: Valid wallet address required for checkout');
    }

    const orderId = `ORD-EXP-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    return {
      success: true,
      orderId,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      buyerWallet: buyerWallet.toLowerCase(),
      status: 'DEMO_CONFIRMED',
      toastMessage: `Purchase confirmed (demo mode) for ${product.name}`
    };
  }
}

/**
 * 3D Interactive Tooling Showcase Geometry Simulator
 */
export const SHOWCASE_MODELS = [
  {
    id: 'lathe-body',
    name: 'Precision CNC Lathe Turning Tool Assembly',
    geometryType: 'LatheGeometry',
    segments: 32,
    verticesCount: 1024,
    materials: {
      metalness: 0.85,
      roughness: 0.25,
      color: '#4a5568'
    },
    orbitControls: {
      minDistance: 2.0,
      maxDistance: 15.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05
    }
  },
  {
    id: 'drill-bit',
    name: 'High-Helix AlTiN Solid Carbide Drill Geometry',
    geometryType: 'CylinderAndConeGeometry',
    segments: 48,
    verticesCount: 1536,
    materials: {
      metalness: 0.90,
      roughness: 0.18,
      color: '#1a202c'
    },
    orbitControls: {
      minDistance: 1.5,
      maxDistance: 12.0,
      maxPolarAngle: Math.PI / 2 + 0.1,
      enableDamping: true,
      dampingFactor: 0.05
    }
  }
];

export class ShowcaseSimulator {
  constructor(models = SHOWCASE_MODELS) {
    this.models = models;
  }

  getModel(id) {
    return this.models.find(m => m.id === id) || null;
  }

  validateOrbitControlParams(controls) {
    if (!controls) return false;
    if (typeof controls.minDistance !== 'number' || controls.minDistance <= 0) return false;
    if (typeof controls.maxDistance !== 'number' || controls.maxDistance <= controls.minDistance) return false;
    if (typeof controls.maxPolarAngle !== 'number' || controls.maxPolarAngle > Math.PI) return false;
    return true;
  }

  generateFallbackGeometry(id) {
    return {
      id: id || 'procedural-placeholder',
      name: 'Procedural Fallback Tool Geometry',
      geometryType: 'BoxGeometry',
      isFallback: true,
      materials: { metalness: 0.5, roughness: 0.5, color: '#26d464' },
      orbitControls: { minDistance: 1.0, maxDistance: 20.0, maxPolarAngle: Math.PI }
    };
  }
}
