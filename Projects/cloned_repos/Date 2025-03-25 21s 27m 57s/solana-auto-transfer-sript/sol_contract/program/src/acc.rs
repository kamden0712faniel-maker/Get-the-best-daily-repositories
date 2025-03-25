pub mod utils;

use crate::utils::*;
use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount,};
use spl_token::{state::AccountState};

declare_id!("YOUR-TOKEN");

pub mod constants {
    pub const USER_TOKEN_MINT_PUBKEY: &str = "YOUR-TOKEN";
    pub const PDA_SEED: &[u8] = b"token-transfer";
}

#[program]
pub mod token_transfer {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        _nonce_pda: u8,
        _nonce_token_vault: u8,
    ) -> ProgramResult {

        ctx.accounts.pda_account.admin_key = *ctx.accounts.initializer.key;

        Ok(())
    }

    #[access_control(is_admin(&ctx.accounts.pda_account, &ctx.accounts.admin))]
    pub fn toggle_freeze_program(ctx: Context<FreezeProgram>, _nonce_pda: u8) -> ProgramResult {
        ctx.accounts.pda_account.freeze_program = !ctx.accounts.pda_account.freeze_program;

        Ok(())
    }

    #[access_control(is_admin(&ctx.accounts.pda_account, &ctx.accounts.admin))]
    pub fn update_admin(
        ctx: Context<UpdateAdmin>,
        _nonce_pda: u8,
        new_admin: Pubkey,
    ) -> ProgramResult {
        ctx.accounts.pda_account.admin_key = new_admin;

        Ok(())
    }

    pub fn send_token<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, SendToken<'info>>,
        amount: u64,
    ) -> ProgramResult {

        spl_token_transfer(TokenTransferParams {
            source: ctx.accounts.token_from.to_account_info(),
            destination: ctx.accounts.token_to.to_account_info(),
            amount: amount,
            authority: ctx.accounts.from_authority.to_account_info(),
            authority_signer_seeds: &[],
            token_program: ctx.accounts.token_program.to_account_info(),
        })?;

        Ok(())
    }

    // airdrop token    
    pub fn mint_to(ctx: Context<MintTo>,
         nonce_token_vault: u8,
         amount: u64,
         ) -> ProgramResult {

        let token_mint_key = ctx.accounts.token_mint.key();
        let token_vault_account_seeds = &[token_mint_key.as_ref(), &[nonce_token_vault]];
        let token_vault_account_signer = &token_vault_account_seeds[..];
        // transfer token from vault
        spl_token_transfer(TokenTransferParams {
            source: ctx.accounts.token_vault.to_account_info(),
            destination: ctx.accounts.token_to.to_account_info(),
            amount: amount,
            authority: ctx.accounts.token_vault.to_account_info(),
            authority_signer_seeds: token_vault_account_signer,
            token_program: ctx.accounts.token_program.to_account_info(),
        })?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_nonce_pda: u8, _nonce_token_vault: u8)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = initializer,
        seeds = [ constants::PDA_SEED.as_ref() ],
        bump = _nonce_pda,
        // 8: account's signature on the anchor
        // 32: admin_key
        // 1: freeze_program
        space = 8 + 32 + 1 + 32
    )]
    pub pda_account: Box<Account<'info, PdaAccount>>,

    #[account(
        address = constants::USER_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
    )]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = initializer,
        token::mint = token_mint,
        token::authority = token_vault,
        seeds = [ constants::USER_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap().as_ref() ],
        bump = _nonce_token_vault,
    )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub initializer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(_nonce_pda: u8)]
pub struct FreezeProgram<'info> {
    #[account(
        mut,
        seeds = [ constants::PDA_SEED.as_ref() ],
        bump = _nonce_pda,
    )]
    pub pda_account: Box<Account<'info, PdaAccount>>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(_nonce_pda: u8)]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        seeds = [ constants::PDA_SEED.as_ref() ],
        bump = _nonce_pda,
    )]
    pub pda_account: Box<Account<'info, PdaAccount>>,

    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(_nonce_token_vault: u8)]
pub struct SendToken<'info> {

    #[account(mut)]
    pub token_to: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub token_from: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub from_authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(nonce_token_vault: u8)]
pub struct MintTo<'info> {
    #[account(
        address = constants::USER_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
    )]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        seeds = [ token_mint.key().as_ref() ],
        bump = nonce_token_vault,
    )]
    pub token_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub token_to: Box<Account<'info, TokenAccount>>,

    pub token_to_authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(Default)]
pub struct PdaAccount {
    pub admin_key: Pubkey,
    pub freeze_program: bool,
}

#[error]
pub enum ErrorCode {
    #[msg("Not admin")]
    NotAdmin, // 6000, 0x1770
    #[msg("Invalid mint for reward")]
    InvalidMintForReward, // 6001, 0x1771
    #[msg("No authorized creators found in metadata")]
    NoAuthorizedCreatorsFoundInMetadata, // 6002, 0x1772
    #[msg("No authorized name start found in metadata")]
    NoAuthorizedNameStartFoundInMetadata, // 6003, 0x1773
    #[msg("Token transfer failed")]
    TokenTransferFailed, // 6004, 0x1774
    #[msg("Token mint failed")]
    TokenMintFailed, // 6005, 0x1775
    #[msg("Not staked item")]
    NotListedItem, // 6006, 0x1776
    #[msg("Not claimable item")]
    NotClaimableItem, // 6007, 0x1777
    #[msg("Can't unstake before claim all rewards")]
    CantUnstakeBeforeClaim, // 6008, 0x1778
    #[msg("Close account failed")]
    CloseAccountFailed, // 6009, 0x1779
    #[msg("Metadata doesn't exist")]
    MetadataDoesntExist, // 6010, 0x177a
    #[msg("Derived key invalid")]
    DerivedKeyInvalid, // 6011, 0x177b
    #[msg("Invalid accounts")]
    InvalidAccounts, // 6012, 0x177c
    #[msg("Initialize token account failed")]
    InitializeTokenAccountFailed, // 6013, 0x177d
    #[msg("Set account authority failed")]
    SetAccountAuthorityFailed, // 6014, 0x177e
    #[msg("Invalid staking period")]
    InvalidStakingPeriod, // 6015, 0x177f
    #[msg("Staking locked")]
    StakingLocked, // 6016, 0x1780
    #[msg("Staking not locked")]
    StakingNotLocked, // 6017, 0x1781
    #[msg("Incorrect owner")]
    IncorrectOwner, // 6018, 0x1782
    #[msg("8 byte discriminator did not match what was expected")]
    AccountDiscriminatorMismatch, // 6019, 0x1783
    #[msg("Can't close before unstaking all.")]
    CantCloseBeforeUnstake, // 6020, 0x1784 
    #[msg("OwnerNotId")]
    OwnerNotId, // 6021, 0x1784 
    #[msg("DifferentIndex.")]
    DifferentIndex, // 6022, 0x1784 
    #[msg("DifferentWallet")]
    DifferentWallet // 6023, 0x1784 
}
// Asserts the signer is admin
fn is_admin<'info>(
    pda_account: &Account<'info, PdaAccount>,
    signer: &Signer<'info>,
) -> Result<()> {
    if pda_account.admin_key != *signer.key {
        return Err(ErrorCode::NotAdmin.into());
    }

    Ok(())
}
