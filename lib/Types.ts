export interface InitOptions {
  apiBase?: string
}

export type AccountsOrderBy = 'accountId' | 'createdAt' | 'balanceUnlocked';

export interface Account {
  id: string;
  appId: string;
  balanceUnlocked: number;
  balanceLocked: number;
  createdAt: number;
  deleted: boolean;
  paymentId: string;
  spendSignaturePrefix: string;
  depositAddress: string;
  depositQrCode: string;
  withdrawAddress?: string;
  data?: any;
}

export type DepositStatus = 'confirming' | 'completed';

export interface Deposit {
  id: string;
  appId: string;
  accountId: string;
  blockHeight: number;
  amount: number;
  depositAddress: string;
  paymentId: string;
  integratedAddress: string;
  status: DepositStatus;
  txHash: string;
  createdDate: number;
  accountCredited: boolean;
  lastUpdate: number;
  cancelled: boolean;
}

export interface Transfer {
  id: string;
  appId: string;
  senderId: string;
  recipients: Recipient[];
  timestamp: number;
}

export interface Recipient {
  accountId: string;
  amount: number;
}

export type WithdrawStatus = 'pending' | 'confirming' | 'faulty' | 'lost' | 'completed';

export interface Withdrawal {
  id: string;
  paymentId: string;
  appId: string;
  accountId: string;
  amount: number;
  fees: Fees;
  serviceChargeId?: string;
  userDebited: boolean;
  address: string;
  timestamp: number;
  lastUpdate: number;
  status: WithdrawStatus;
  requestedAtBlock: number;
  blockHeight: number;
  failed: boolean;
  preparedWithdrawalId: string;
  txHash: string;
  daemonErrorCode?: number;
  retries: number;
}

export interface WithdrawalPreview {
  id: string;
  appId: string;
  accountId: string;
  timestamp: number;
  address: string;
  amount: number;
  fees: Fees;
}

export interface Fees {
  txFee: number;
  nodeFee: number;
  serviceFee: number;
}