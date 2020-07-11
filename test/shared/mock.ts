import StarkwareController from 'starkware-controller';
import { Wallet } from 'ethers';

import { EventEmitter } from 'events';

import { IRpcConnection } from '../../src';

const storage = {};

const store = {
  set: async (key: string, data: any) => {
    storage[key] = data;
  },
  get: async (key: string) => {
    return storage[key];
  },
  remove: async (key: string) => {
    delete storage[key];
  },
};

export class MockWalletController {
  private starkwareController: StarkwareController;
  constructor(mnemonic: string) {
    const wallet = Wallet.fromMnemonic(mnemonic);
    this.starkwareController = new StarkwareController(wallet, store);
  }
  resolve(payload: any) {
    return this.starkwareController.resolve(payload);
  }
}

export class MockRpcConnection extends EventEmitter implements IRpcConnection {
  public connected: boolean = false;

  constructor(private readonly walletController: MockWalletController) {
    super();
  }

  public async open(): Promise<void> {
    this.connected = true;
    this.emit('open');
    this.emit('connect');
  }

  public async close(): Promise<void> {
    this.connected = false;
    this.emit('close');
    this.emit('disconnect');
  }

  public async send(payload: any) {
    const res: any = await this.walletController.resolve(payload);
    if (res.result) {
      return res.result;
    } else {
      if (res.error && res.error.message) {
        throw new Error(res.error.message);
      } else {
        throw new Error(
          `Failed JSON-RPC request with method: ${payload.method}`
        );
      }
    }
  }
}

export function getMockConnection(mnemonic: string) {
  const walletController = new MockWalletController(mnemonic);
  return new MockRpcConnection(walletController);
}
