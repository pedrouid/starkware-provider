import BN from 'bn.js';

export * from 'starkware-types';

export interface SignatureOptions {
  r: BN;
  s: BN;
  recoveryParam: number | null | undefined;
}
