import axios from 'axios';
import { AppUser, AppDepositRequest } from './types';
import { ServiceError } from './serviceError';

export class TrtlAppsBackend {

    private apiBase = 'https://trtlapps.io/api/';
    private initialized: boolean = false;
    private appId: string | undefined;

    constructor(appId: string, appSecret: string) {
        this.initialize(appId, appSecret);
    }

    public initialize(appId: string, appSecret: string): void {
        this.appId = appId;
        this.initialized = true;
        axios.defaults.headers.common = {'Authorization': `Bearer ${appSecret}`}
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public getAppId(): string | undefined {
        return this.appId;
    }

    public async createUser(): Promise<[AppUser | undefined, undefined | ServiceError]> {
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

    public async depositRequest(
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

    public async setWithdrawAddress(
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
}