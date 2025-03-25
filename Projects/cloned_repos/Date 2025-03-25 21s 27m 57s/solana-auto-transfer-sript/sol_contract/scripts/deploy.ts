import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TokenContract } from '../src/contracts/TokenContract';
import * as anchor from '@project-serum/anchor';
import { config } from 'dotenv';
import * as bs58 from 'bs58';

config();

async function main() {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    const privateKeyString = process.env.PRIVATE_KEY;
    
    if (!privateKeyString) {
        throw new Error('Private key not found in .env file');
    }

    const privateKeyBytes = bs58.decode(privateKeyString);
    const wallet = Keypair.fromSecretKey(privateKeyBytes);

    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        { commitment: 'confirmed' }
    );

    const contract = new TokenContract(provider);
    
    try {
        const signature = await contract.createTokenAccount();
        const randomAddress = new PublicKey(Keypair.generate().publicKey.toBase58());
        console.log(`Token Account Address: ${randomAddress.toBase58()}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 