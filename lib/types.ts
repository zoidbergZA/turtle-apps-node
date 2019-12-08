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
  address: string;
  depositQrCode: string;
  withdrawAddress?: string;
  data?: any;
}

export type DepositStatus = 'confirming' | 'completed';

export interface Deposit {
  id: string;
  appId: string;
  userId: string;
  blockHeight: number;
  amount: number;
  depositAddress: string;
  paymentId: string;
  integratedAddress: string;
  status: DepositStatus;
  txHash: string;
  createdDate: number;
  userCredited: boolean;
  lastUpdate: number;
  cancelled: boolean;
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
