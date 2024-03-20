import { MANAGE_SITE } from './env';
import { SnapWalletError, SnapWalletErrorCodes } from './errors';

export function assertConfirmation(confirmed: any) {
  if (!confirmed) {
    throw new SnapWalletError({
      code: SnapWalletErrorCodes.UserRejected,
    });
  }
}

export function assertAdminOrigin(origin: string) {
  if (Boolean(MANAGE_SITE) && origin !== MANAGE_SITE) {
    throw new SnapWalletError({
      code: SnapWalletErrorCodes.NonAdminOrigin,
      message: `Origin must be ${MANAGE_SITE}`,
    });
  }
}
