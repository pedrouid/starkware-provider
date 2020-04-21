import StarkwareProvider from '../src';

import { getMockConnection, TEST_CONTRACT_ADDRESS } from './shared/';

describe('starkware-provider', () => {
  it('should instantiate sucessfully', async () => {
    const connection = getMockConnection();
    const provider = new StarkwareProvider(connection, TEST_CONTRACT_ADDRESS);
    expect(provider).toBeTruthy();
  });
});
