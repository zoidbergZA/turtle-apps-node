export interface InitOptions {
  apiBase?: string
}

export type UsersOrderBy = 'userId' | 'createdAt' | 'balanceUnlocked';

export interface AppUser {
  userId: string;
  balanceUnlocked: number;
  balanceLocked: number;
  createdAt: number;
  deleted: boolean;
  paymentId: string;
  withdrawAddress?: string;
  data?: any;
}

export type DepositStatus = 'pending' | 'confirming' | 'finalizing' | 'completed';

export interface Deposit {
  id: string;
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
  id: string;
  appId: string;
  senderId: string;
  recipients: Recipient[];
  timestamp: number;
}

export interface Recipient {
  userId: string;
  amount: number;
}

export type WithdrawStatus = 'confirming' | 'completed';

export interface Withdrawal
{
  id: string;
  paymentId: string,
  appId: string;
  userId: string;
  amount: number;
  fee: number;
  sendAddress: string;
  timestamp: number;
  lastUpdate: number;
  status: WithdrawStatus;
  requestedAtBlock: number;
  blockHeight: number;
  failed: boolean;
  txHash?: string;
  callbackUrl?: string;
}
