import StarkwareProvider from '../src';

import { getMockConnection, TEST_CONTRACT_ADDRESS } from './shared/';

const mnemonic =
  'puzzle number lab sense puzzle escape glove faith strike poem acoustic picture grit struggle know tuna soul indoor thumb dune fit job timber motor';
const layer = 'starkex';
const application = 'starkexdvf';
const index = '0';

const starkPublicKey =
  '0x017e159e246999ee9ce7d1103d5d0d52c468bcb385d202ef362de2f878162c48';

describe('starkware-provider', () => {
  let provider: StarkwareProvider;
  beforeEach(() => {
    const connection = getMockConnection(mnemonic);
    provider = new StarkwareProvider(connection, TEST_CONTRACT_ADDRESS);
  });
  it('should instantiate sucessfully', async () => {
    expect(provider).toBeTruthy();
  });
  it('should enable successfully', async () => {
    const result = await provider.enable(layer, application, index);
    expect(result).toBeTruthy();
    expect(result).toEqual(starkPublicKey);
  });
  it('should send successfully', async () => {
    const result = await provider.send('stark_account', {
      layer,
      application,
      index,
    });
    expect(result).toBeTruthy();
    expect(result.starkPublicKey).toEqual(starkPublicKey);
  });
});
