import EventEmitter from 'eventemitter3';
import { Token, TransferParams, OrderParams } from './types';

export interface IRpcConnection extends NodeJS.EventEmitter {
  connected: boolean;

  send(payload: any): Promise<any>;
  open(): Promise<void>;
  close(): Promise<void>;
}

export interface IStarkwareProvider extends EventEmitter {
  // provider properties
  connected: boolean;
  contractAddress: string;
  starkPublicKey?: string;

  // connection methods
  send(method: string, params?: any): Promise<any>;
  open(): void;
  close(): void;

  // provider methods
  enable(path: string): Promise<string>;
  send(method: string, params?: any): Promise<any>;
  open(): void;
  close(): void;
  updateAccount(path: string): Promise<string>;
  getActiveAccount(): Promise<string>;
  getAccount(path: string): Promise<string>;
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
