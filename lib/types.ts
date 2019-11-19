export interface InitOptions {
  apiBase?: string
}

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
  callbackUrl?: string;
}

export interface UserTransfer {
  transferId: string;
  appId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  timestamp: number;
}

export type WithdrawStatus = 'confirming' | 'completed';

export interface WithdrawRequest
{
  requestId: string;
  paymentId: string,
  appId: string;
  userId: string;
  amount: number;
  fee: number;
  timestamp: number;
  lastUpdate: number;
  status: WithdrawStatus;
  requestedAtBlock: number;
  blockHeight: number;
  failed: boolean;
  txHash?: string;
  callbackUrl?: string;
}
