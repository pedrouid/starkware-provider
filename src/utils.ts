import BN from 'bn.js';
import * as encUtils from 'enc-utils';

import { SignatureOptions } from './types';

export function exportRecoveryParam(
  recoveryParam: number | null | undefined
): string | null {
  return typeof recoveryParam === 'number'
    ? new BN(recoveryParam).add(new BN(27)).toString(16)
    : null;
}

export function importRecoveryParam(v: string): number {
  return new BN(v, 16).sub(new BN(27)).toNumber();
}

export function serializeSignature(sig: SignatureOptions): string {
  return encUtils.addHexPrefix(
    sig.r.toString(16) +
      sig.s.toString(16) +
      exportRecoveryParam(sig.recoveryParam)
  );
}

export function deserializeSignature(sig: string): SignatureOptions {
  sig = encUtils.removeHexPrefix(sig);
  return {
    r: new BN(sig.substring(0, 64), 'hex'),
    s: new BN(sig.substring(64, 128), 'hex'),
    recoveryParam: importRecoveryParam(sig.substring(128, 130)),
  };
}
