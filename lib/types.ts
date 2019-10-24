export interface AppUser {
    userId: string;
    withdrawAddress?: string;
    balanceUnlocked: number;
    balanceLocked: number;
    createdAt: number;
    deleted: boolean;
    data?: any;
}

export type DepositStatus = 'pending' | 'confirming' | 'finalizing' | 'completed';

export interface AppDepositRequest {
  requestId: string;
  appId: string;
  userId: string;
  amountRequested: number;
  amountConfirmed: number;
  amountUnconfirmed: number;
  depositAddress: string;
  paymentId: string;
  integratedAddress: string;
  status: DepositStatus;
  txHashes: string[];
  createdDate: number;
  expireDate: number;
  userCredited: boolean;
  userCreditedAmount: number;
  expired: boolean;
  qrCode: string;
  lastUpdate: number;
}