# starkware-provider [![npm version](https://badge.fury.io/js/starkware-provider.svg)](https://badge.fury.io/js/starkware-provider)

Starkware Provider Library

## Example

```javascript
import StarkwareProvider, { IRpcConnection } from 'starkware-provider';

const connection: IRpcConnection
const contractAddress = '0xC5273AbFb36550090095B1EDec019216AD21BE6c'

//  Create StarkwareProvider Provider
const provider = new StarkwareProvider(connection, contractAddress);

//  Enable session (inc. openning connection)
const starkPublicKey = await provider.enable();
```

## Provider API

```typescript
class StarkwareProvider {
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
  enable(path: string): Promise<string>;
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
```

## Typings

```typescript
interface IRpcConnection extends NodeJS.EventEmitter {
  connected: boolean;

  send(payload: any): Promise<any>;
  open(): Promise<void>;
  close(): Promise<void>;
}

interface ETHTokenData {
  quantum: string;
}

interface ERC20TokenData {
  quantum: string;
  tokenAddress: string;
}

interface ERC721TokenData {
  tokenId: string;
  tokenAddress: string;
}

type TokenTypes = 'ETH' | 'ERC20' | 'ERC721';

type TokenData = ETHTokenData | ERC20TokenData | ERC721TokenData;

interface Token {
  type: TokenTypes;
  data: TokenData;
}

interface TransferParams {
  starkPublicKey: string;
  vaultId: string;
}

interface OrderParams {
  vaultId: string;
  token: Token;
  quantizedAmount: string;
}
```
