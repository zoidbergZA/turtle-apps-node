import axios from 'axios';
import { AppUser, AppDepositRequest, UserTransfer } from './types';
import { ServiceError } from './serviceError';

export class TrtlAppsBackend {
    private static readonly apiBase = 'https://trtlapps.io/api/';
    private static initialized: boolean = false;
    private static appId: string | undefined;

    /**
     * Initializes the app service.
     * @param {string} appId - The ID of the app the app.
     * @param {string} appSecret - The secret key of the app.
     */
    public static initialize(appId: string, appSecret: string): void {
        this.appId = appId;
        axios.defaults.headers.common = {'Authorization': `Bearer ${appSecret}`}

        this.initialized = true;
    }

    public static isInitialized(): boolean {
        return this.initialized;
    }

    public static getAppId(): string | undefined {
        return this.appId;
    }

    public static async createUser(): Promise<[AppUser | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}createuser?appId=${this.appId}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data as AppUser, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    public static async depositRequest(
        userId: string,
        amount: number): Promise<[AppDepositRequest | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}depositrequest?appId=${this.appId}&userId=${userId}&amount=${amount}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data as AppDepositRequest, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    public static async setWithdrawAddress(
        userId: string,
        address: string): Promise<[string | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}setwithdrawaddress?appId=${this.appId}&userId=${userId}&address=${address}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data.withdrawAddress as string, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    public static async userTransfer(
        senderId: string,
        receiverId: string,
        amount: number): Promise<[string | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}usertransfer?appId=${this.appId}&senderId=${senderId}&receiverId=${receiverId}&amount=${amount}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data.transferId as string, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    public static async getFee(): Promise<[number | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}getfee?appId=${this.appId}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data.fee as number, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    public static async withdraw(
        userId: string,
        amount: number): Promise<[string | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}withdraw?appId=${this.appId}&userId=${userId}&amount=${amount}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data.requestId as string, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }
}