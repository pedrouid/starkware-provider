import { EventEmitter } from 'events';

import { IRpcConnection } from '../../src';

export class MockWalletController {
  dispatch(payload: any) {}
}

export class MockRpcConnection extends EventEmitter implements IRpcConnection {
  public connected: boolean = false;

  constructor(private readonly walletController: MockWalletController) {
    super();
  }

  public async open(): Promise<void> {
    this.connected = true;
  }

  public async close(): Promise<void> {
    this.connected = false;
  }

  public async send(payload: any) {
    return this.walletController.dispatch(payload);
  }
}

export function getMockConnection() {
  const walletController = new MockWalletController();
  return new MockRpcConnection(walletController);
}
