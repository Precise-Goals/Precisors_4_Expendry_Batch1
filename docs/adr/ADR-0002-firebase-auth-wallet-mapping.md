# ADR-0002: Wallet Address as Primary Identity Mapped to Firebase Authentication

## Status
Accepted

## Context
Expendry requires a seamless user authentication flow that accommodates EVM wallets (BridgeKey primary, MetaMask fallback) on MST Testnet while enabling real-time community feeds, post authoring, and profile management in Firebase Firestore.

Traditional Web2 authentication (email/password, OAuth) introduces high onboarding friction and disconnects the user's session from their on-chain wallet holding EXPEN tokens. Conversely, requiring manual wallet signatures for every single database operation produces terrible shop-floor UX.

## Decision
We establish the machinist's **wallet address as the primary identity** of the platform and map it to a **Firebase Authentication custom session** via an EIP-191 challenge-response protocol.

### Authentication Protocol
1. **Challenge Request**: The client requests a cryptographically unique, timestamped nonce from `/api/auth/nonce`.
2. **EIP-191 Signature**: The user signs the structured challenge message (`Sign this message to authenticate with Expendry...\nNonce: <nonce>`) using BridgeKey or MetaMask.
3. **Signature Verification**: The client posts `{ address, signature, message }` to `/api/auth/verify`. The server recovers the signer address via `ethers.verifyMessage`.
4. **Custom Token Issuance**: On valid signature match, the server generates a Firebase custom auth token using `adminAuth.createCustomToken("wallet:<address>")`.
5. **Firestore Upsert**: The server creates or updates the user profile record in `users/wallet:<address>` with designation, company, and role.
6. **Session Establishment**: The client exchanges the custom token via `signInWithCustomToken(auth, customToken)` to obtain standard Firebase session credentials.

## Rationale
- **Zero-Friction Web3 Onboarding**: Machinists connect their BridgeKey wallet and authenticate in a single click without creating a password.
- **Granular Security Rules**: Firestore security rules can directly enforce authorization using `request.auth.uid == 'wallet:' + resource.data.authorWallet`.
- **Replay Protection**: The challenge includes a short-lived nonce tied to the signing timestamp, preventing replay attacks.
- **Address Canonicalization**: Addresses are normalized to lowercase, preventing case-sensitivity mismatches between checksummed EVM formats and Firestore document keys.

## Alternatives Considered
1. **Traditional Email/Password Linked to Wallet**: High onboarding abandonment; contradicts Web3 testnet reward loop requirements.
2. **Pure Client-Side Firestore without Auth**: Leaves the database publicly writable without cryptographic author attribution.
3. **Full Sign-In with Ethereum (SIWE / ERC-4361) Spec**: Adds excessive parsing overhead; custom EIP-191 challenge provides equivalent security with zero external runtime dependencies.

## Consequences
- **Positive**:
  - Secure, native Web3 login experience.
  - Full compatibility with Firestore real-time listeners (`onSnapshot`) and security rules.
  - Automatic profile document creation on first connection.
- **Negative**:
  - Requires maintaining Firebase Admin SDK private key on server routes to issue custom tokens.
