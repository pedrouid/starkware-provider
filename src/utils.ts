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

export function importRecoveryParam(v: string): number | undefined {
  return v.trim() ? new BN(v, 16).sub(new BN(27)).toNumber() : undefined;
}

export function serializeSignature(sig: SignatureOptions): string {
  const v = exportRecoveryParam(sig.recoveryParam);
  return encUtils.addHexPrefix(
    sig.r.toString(16) + sig.s.toString(16) + v || ''
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
