import BasicProvider from 'basic-provider';
import { Token, TransferParams, OrderParams } from './types';

export { IRpcConnection } from 'basic-provider';

export interface IStarkwareProvider extends BasicProvider {
  // connection properties
  connected: boolean;

  // provider properties
  contractAddress: string;
  starkPublicKey?: string;

  // connection methods
  send(method: string, params?: any): Promise<any>;
  open(): Promise<void>;
  close(): Promise<void>;

  // provider methods
  enable(layer: string, application: string, index: string): Promise<string>;
  updateAccount(
    layer: string,
    application: string,
    index: string
  ): Promise<string>;
  getActiveAccount(): Promise<string>;
  getAccount(
    layer: string,
    application: string,
    index: string
  ): Promise<string>;
  register(operatorSignature: string): Promise<string>;
  deposit(
    quantizedAmount: string,
    token: Token,
    vaultId: string
  ): Promise<string>;
  depositCancel(token: Token, vaultId: string): Promise<string>;
  depositReclaim(token: Token, vaultId: string): Promise<string>;
  transfer(
    to: TransferParams,
    vaultId: string,
    token: Token,
    quantizedAmount: string,
    nonce: string,
    expirationTimestamp: string
  ): Promise<string>;
  createOrder(
    sell: OrderParams,
    buy: OrderParams,
    nonce: string,
    expirationTimestamp: string
  ): Promise<string>;
  withdraw(token: Token): Promise<string>;
  withdrawFull(vaultId: string): Promise<string>;
  freezeVault(vaultId: string): Promise<string>;
  verifyEspace(proof: string[]): Promise<string>;
  escape(
    vaultId: string,
    token: Token,
    quantizedAmount: string
  ): Promise<string>;
}
