# Stellar Campus Loyalty UNIP

This project is a simulation of an **"Anchor"** that transforms real-world (off-chain) TL spending into verifiable digital rewards (on-chain) on the Stellar network.

This hackathon project was developed as a response to the question:
**"How can we benefit from Stellar's power without forcing people to use XLM?"**

![Stellar](https://img.shields.io/badge/Stellar-Blockchain-000000?style=for-the-badge&logo=stellar)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwindcss)



## 1. Problem: The Bridge Between "Real World" and "Blockchain"

The biggest challenge for blockchain-based loyalty programs is **mass adoption**:

1. **User Barrier:** Students don’t want to pay with cryptocurrency (XLM). They want to continue using TL and credit cards (off-chain).
2. **Trust Barrier:** Traditional loyalty points are "digital numbers" stored in a centralized database. Users do not truly own them, and they are not transparent.
3. **Integration Barrier:** How can a real-world (off-chain) TL transaction be reported to the blockchain (on-chain)?

## 2. Solution: "Anchor" Simulation

Our project simulates Stellar’s core architecture — the **"Anchor"** system — to build this bridge.

In this architecture, the **University (Administration)** takes on the role of a trusted Anchor:

1. The student makes a 100 TL purchase using a **credit card (off-chain)**.
2. Our “Cashier Interface” (`/kasiyer`) acts as an **Oracle**, verifying the off-chain purchase.
3. The cashier submits the student’s wallet address and the 100 TL purchase to our API.
4. Our API (the brain of the Anchor) sends **5 `PUAN` tokens** (our Stellar asset) to the student.

Result?  
The student does not change their habits (pays in TL), but receives rewards as **transparent, verifiable, and truly owned** digital assets (on-chain `PUAN` token).

## 3. Project Architecture: Separation of Authority

Our project uses 3 different accounts based on Stellar’s enterprise capabilities:

1. **"Dean" (Issuer):**
   - **Role:** Creates the `PUAN` token.
   - **Superpower:** Holds the `Clawback` privilege for future penalty/discipline features. This gives full authority to the dean.

2. **"Operator" (Distributor):**
   - **Role:** Holds the token supply (e.g., 1 million `PUAN`).
   - **Superpower:** Our `app/api/send-reward` API uses this account’s **Secret Key** to distribute daily rewards to students. This ensures operations run without risking the "Dean’s" Secret Key.

3. **"Student" (Receiver):**
   - **Role:** Opens a `Trustline` to the `PUAN` token and receives/holds the tokens.



## 4. Main Features

**Live Student Dashboard (`/`):**
- Wallet connection using `@creit.tech/stellar-wallets-kit` with Freighter.
- `lib/loyalty-reader.ts` engine reads the student’s `PUAN` balance from Stellar Testnet **every 5 seconds**.
- QR code generation with `react-qr-code` so students can show their wallet addresses to the cashier.
- Privilege cards unlock automatically based on the user’s balance (🔒 → 🔓).

**Cashier Interface / Anchor Simulation (`/kasiyer`):**
- A panel where the cashier enters the student's address and TL amount (off-chain).
- “Send Reward” button triggers `app/api/send-reward`.

**Secure Backend API (`/api/send-reward`):**
- Uses the "Operator" wallet's `Secret Key` to sign the transaction server-side.
- Sends 5% of the TL amount as `PUAN` tokens from the Operator’s supply.



## 5. Technologies Used

- **Frontend:** Next.js, React 18, TypeScript  
- **Styling:** Tailwind CSS  
- **Blockchain (Stellar):**
  - `stellar-sdk`: Used on backend to build and sign transactions.
  - `@creit.tech/stellar-wallets-kit`: Used on frontend for wallet connection.
- **UI Components:** `react-qr-code`
- **Infrastructure:** Stellar Testnet



## 6. Local Setup (How to Run)

This project requires both Stellar setup and code setup.

### Step 1: (Required) Stellar Wallet Setup

The project requires **3 wallets**. Using [Stellar Laboratory (Testnet)](https://laboratory.stellar.org/#account-creator?network=test), create and fund:

1. **Dean (Issuer)** — Save Public & Secret Keys
2. **Operator (Distributor)** — Save Public & Secret Keys
3. **Test Student** — Save Public & Secret Keys

### Step 2: (Required) Token Creation & Supply Transfer

1. Open **Transaction Builder** in Stellar Laboratory.
2. From **Operator**, create a `Change Trust` operation for the `PUAN` token issued by the Dean.
3. From **Dean**, create a `Payment` operation sending 1,000,000 `PUAN` to the Operator.
4. Combine both operations into a single transaction.
5. Sign the transaction with both **Operator** and **Dean** Secret Keys and submit.  
   *(This is the "Multi-Signature" step in `PHASE 1`.)*

### Step 3: (Required) Student Trustline

Using the **Test Student** wallet, create a `Change Trust` operation to the Dean’s `PUAN` token.  
(You can also do this from Freighter’s **Add Asset** menu.)

### Step 4: Project Setup

1. Clone the project:
   ```bash
   git clone [YOUR-GITHUB-LINK]
   cd Kampus-Projesi
   ```

2. Install required packages:
   ```bash
   npm install
   npm install stellar-sdk @creit.tech/stellar-wallets-kit react-qr-code
   ```

3. **Update the Code (Most Important Step):**
   - Open `app/api/send-reward/route.ts`:
     - Set `ADMIN_SECRET_KEY` = **Operator’s Secret Key**
     - Set `ADMIN_PUBLIC_KEY` = **Operator’s Public Key**
     - Set the `Issuer` of the `REWARD_TOKEN` Asset = **Dean’s Public Key**
   - Open `lib/loyalty-reader.ts`:
     - Set `REWARD_ISSUER` = **Dean’s Public Key**

4. Start the server:
   ```bash
   npm run dev
   ```

5. You are ready to demo:
   - **Student Dashboard:** `http://localhost:3000`
   - **Cashier Interface:** `http://localhost:3000/kasiyer`



## 7. Future Plans & Improvements

- **Clawback Integration:** Add `/api/clawback-fine` for penalty-based token removal.
- **Automatic Trustline:** Add a "Register to System" button that automatically creates a Trustline.
- **Real POS Integration:** Replace the manual cashier form with a real POS terminal (e.g., Verifone, Ingenico).
