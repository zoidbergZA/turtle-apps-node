import axios from 'axios';
import { AppUser, AppDepositRequest, UserTransfer } from './Types';
import { ServiceError } from './ServiceError';

export class TrtlApp {
    private static readonly apiBase = 'https://trtlapps.io/api/';
    private static initialized: boolean = false;
    private static appId: string | undefined;

    /**
     * Initializes the app service, call this before any other functions.
     * You can find your app ID and secret in the developer console.
     *
     * Example:
     *
     * ```ts
     * import { TrtlApp } from 'turtle-apps-node';
     *
     * TrtlApp.initialize('YOUR_APP_ID', 'YOUR_APP_SECRET');
     * ```
     * @param {string} appId - The ID of the app.
     * @param {string} appSecret - The secret key of the app.
     */
    public static initialize(appId: string, appSecret: string): void {
        this.appId = appId;
        axios.defaults.headers.common = {'Authorization': `Bearer ${appSecret}`}

        this.initialized = true;
    }

    /**
     * Creates a new app user.
     *
     * Example:
     *
     * ```ts
     *
     * const [userId, error] = TrtlApp.createUser();
     *
     * if (userId) {
     *  console.log(`New user created with id: ${userId}`);
     * }
     * ```
     * @returns {string} Returns the userId of the newly created user or an error.
     */
    public static async createUser(): Promise<[string | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}createuser?appId=${this.appId}`;

        try {
            const response = await axios.get(endpoint);
            return [(response.data as AppUser).userId, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    public static async getUser(userId: string): Promise<[AppUser | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}getuser?appId=${this.appId}&userId=${userId}`;

        try {
            const response = await axios.get(endpoint);
            return [(response.data as AppUser), undefined];
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