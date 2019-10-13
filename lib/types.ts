export interface AppUser {
    userId: string;
    withdrawAddress?: string;
    balanceUnlocked: number;
    balanceLocked: number;
    createdAt: number;
    deleted: boolean;
    data?: any;
  }
