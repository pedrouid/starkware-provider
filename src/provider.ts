import BasicProvider from 'basic-provider';

import { IRpcConnection, IStarkwareProvider } from './interfaces';
import { AccountParams, Token, TransferParams, OrderParams } from './types';
import { MethodResults, MethodParams } from 'starkware-types';

function matches(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false;
  let match = true;
  Object.keys(a).forEach(key => {
    if (a[key] !== b[key]) match = false;
  });
  return match;
}

// -- StarkwareProvider ---------------------------------------------------- //

class StarkwareProvider extends BasicProvider implements IStarkwareProvider {
  private accountParams: AccountParams | undefined;

  public contractAddress: string;
  public starkPublicKey: string | undefined;

  constructor(connection: IRpcConnection, contractAddress: string) {
    super(connection);
    this.contractAddress = contractAddress;
  }

  // -- public ---------------------------------------------------------------- //

  public async enable(
    layer: string,
    application: string,
    index: string
  ): Promise<string> {
    try {
      await this.open();
      const starkPublicKey = await this.updateAccount(
        layer,
        application,
        index
      );
      this.emit('enable');
      return starkPublicKey;
    } catch (err) {
      await this.close();
      throw err;
    }
  }

  public async updateAccount(
    layer: string,
    application: string,
    index: string
  ): Promise<string> {
    const accountParams: AccountParams = { layer, application, index };
    if (this.starkPublicKey && matches(this.accountParams, accountParams)) {
      return this.starkPublicKey;
    }
    const starkPublicKey = await this.getAccount(layer, application, index);
    return starkPublicKey;
  }

  public async getActiveAccount(): Promise<string> {
    if (!this.accountParams) {
      throw new Error(
        'No StarkPublicKey available - please call provider.enable()'
      );
    }
    if (this.starkPublicKey) {
      return this.starkPublicKey;
    }
    const { layer, application, index } = this.accountParams;
    const starkPublicKey = await this.getAccount(layer, application, index);
    return starkPublicKey;
  }

  public async getAccount(
    layer: string,
    application: string,
    index: string
  ): Promise<string> {
    this.accountParams = { layer, application, index };
    const { starkPublicKey } = await this.send<
      MethodResults.StarkAccountResult,
      MethodParams.StarkAccountParams
    >('stark_account', {
      layer,
      application,
      index,
    });
    this.starkPublicKey = starkPublicKey;
    return starkPublicKey;
  }

  public async register(operatorSignature: string): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkRegisterResult,
      MethodParams.StarkRegisterParams
    >('stark_register', {
      contractAddress,
      starkPublicKey,
      operatorSignature,
    });
    return txhash;
  }

  public async deposit(
    quantizedAmount: string,
    token: Token,
    vaultId: string
  ): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkDepositResult,
      MethodParams.StarkDepositParams
    >('stark_deposit', {
      contractAddress,
      starkPublicKey,
      quantizedAmount,
      token,
      vaultId,
    });
    return txhash;
  }

  public async depositCancel(token: Token, vaultId: string): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkDepositCancelResult,
      MethodParams.StarkDepositCancelParams
    >('stark_depositCancel', {
      contractAddress,
      starkPublicKey,
      token,
      vaultId,
    });
    return txhash;
  }

  public async depositReclaim(token: Token, vaultId: string): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkDepositReclaimResult,
      MethodParams.StarkDepositReclaimParams
    >('stark_depositReclaim', {
      contractAddress,
      starkPublicKey,
      token,
      vaultId,
    });
    return txhash;
  }

  public async transfer(
    to: TransferParams,
    vaultId: string,
    token: Token,
    quantizedAmount: string,
    nonce: string,
    expirationTimestamp: string
  ): Promise<string> {
    const starkPublicKey = await this.getActiveAccount();
    const from = { starkPublicKey, vaultId };
    const { starkSignature } = await this.send<
      MethodResults.StarkTransferResult,
      MethodParams.StarkTransferParams
    >('stark_transfer', {
      from,
      to,
      token,
      quantizedAmount,
      nonce,
      expirationTimestamp,
    });
    return starkSignature;
  }

  public async createOrder(
    sell: OrderParams,
    buy: OrderParams,
    nonce: string,
    expirationTimestamp: string
  ): Promise<string> {
    const starkPublicKey = await this.getActiveAccount();
    const { starkSignature } = await this.send<
      MethodResults.StarkCreateOrderResult,
      MethodParams.StarkCreateOrderParams
    >('stark_createOrder', {
      starkPublicKey,
      sell,
      buy,
      nonce,
      expirationTimestamp,
    });
    return starkSignature;
  }

  public async withdraw(token: Token): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkWithdrawalResult,
      MethodParams.StarkWithdrawalParams
    >('stark_withdrawal', {
      contractAddress,
      starkPublicKey,
      token,
    });
    return txhash;
  }

  public async withdrawFull(vaultId: string): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkFullWithdrawalResult,
      MethodParams.StarkFullWithdrawalParams
    >('stark_fullWithdrawal', {
      contractAddress,
      starkPublicKey,
      vaultId,
    });
    return txhash;
  }

  public async freezeVault(vaultId: string): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkFreezeResult,
      MethodParams.StarkFreezeParams
    >('stark_freeze', {
      contractAddress,
      starkPublicKey,
      vaultId,
    });
    return txhash;
  }

  public async verifyEspace(proof: string[]): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkVerifyEscapeResult,
      MethodParams.StarkVerifyEscapeParams
    >('stark_verifyEscape', {
      contractAddress,
      starkPublicKey,
      proof,
    });
    return txhash;
  }

  public async escape(
    vaultId: string,
    token: Token,
    quantizedAmount: string
  ): Promise<string> {
    const contractAddress = this.contractAddress;
    const starkPublicKey = await this.getActiveAccount();
    const { txhash } = await this.send<
      MethodResults.StarkEscapeResult,
      MethodParams.StarkEscapeParams
    >('stark_escape', {
      contractAddress,
      starkPublicKey,
      vaultId,
      token,
      quantizedAmount,
    });
    return txhash;
  }
}

export default StarkwareProvider;
