import axios from 'axios';
import { AppUser, AppDepositRequest, WithdrawRequest } from './Types';
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
     * import { TrtlApp } from 'trtl-apps';
     *
     * TrtlApp.initialize('YOUR_APP_ID', 'YOUR_APP_SECRET');
     * ```
     * @param {string} appId The ID of the app.
     * @param {string} appSecret The secret key of the app.
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
     * const [userId, error] = await TrtlApp.createUser();
     *
     * if (userId) {
     *  console.log(`New user created with id: ${userId}`);
     * }
     * ```
     * @returns {Promise<[string | undefined, undefined | ServiceError]>} Returns the userId of the newly created user or an error.
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

    /**
     * Gets an existing app user.
     *
     * Example:
     *
     * ```ts
     *
     * const [user, error] = await TrtlApp.getUser('8RgwiWmgiYKQlUHWGaTW');
     *
     * if (user) {
     *  console.log(`User with id: ${userId} has balance: ${user.balanceUnlocked}`);
     * }
     * ```
     * @param {string} userId The ID of the user to retrieve.
     * @returns {Promise<[AppUser | undefined, undefined | ServiceError]>} Returns the user object or an error.
     */
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

    /**
     * Creates a new deposit request for the user.
     *
     * Example:
     *
     * ```ts
     *
     * const [depositRequest, error] = await TrtlApp.requestDeposit('8RgwiWmgiYKQlUHWGaTW', 42);
     *
     * if (depositRequest) {
     *  console.log(`new deposit request created. qr code: ${depositRequest.qrCode}`);
     * }
     * ```
     * @param {string} userId The id of the user to create the deposit request for.
     * @param {number} amount The amount the user should deposit in atomic units.
     * @param {string} callbackUrl Optional callback URL to send status updates for this deposit request.
     * @returns {Promise<[AppDepositRequest | undefined, undefined | ServiceError]>} Returns the newly created deposit request object or an error.
     */
    public static async requestDeposit(
        userId: string,
        amount: number,
        callbackUrl?: string): Promise<[AppDepositRequest | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}requestdeposit?appId=${this.appId}&userId=${userId}&amount=${amount}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data as AppDepositRequest, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Sets the withdraw address for a user.
     *
     * Example:
     *
     * ```ts
     *
     * const [address, error] = await TrtlApp.setWithdrawAddress('8RgwiWmgiYKQlUHWGaTW', 'TRTLv32bGBP2cfM3SdijU4TTYnCPoR33g5eTas6n9HamBvu8ozc9BWHZza5j7cmBFSgh4dmmGRongfoEEzcvuAEF8dLxixsS7he');
     *
     * if (address) {
     *  console.log(`user withdraw address successfully set to: ${address}`);
     * }
     * ```
     * @param {string} userId The id of the user.
     * @param {string} address The address that withdrawals will be sent to for this user.
     * @returns {Promise<[string | undefined, undefined | ServiceError]>} Returns the newly set withdraw address or an error.
     */
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

    /**
     * Transfer funds from one user to another.
     *
     * Example:
     *
     * ```ts
     *
     * const [transferId, error] = await TrtlApp.userTransfer('8RgwiWmgiYKQlUHWGaTW', 'EWshpvxky57RrAeBCf8Z', 42);
     *
     * if (transferId) {
     *  console.log(`user transfer succeeded, transfer id: ${transferId}`);
     * }
     * ```
     * @param {string} senderId The id of the user sending the funds.
     * @param {string} receiverId The receiving user's id.
     * @param {number} amount The amount to transfer in atomic units.
     * @returns {Promise<[string | undefined, undefined | ServiceError]>} Returns the transfer id if the transfer succeeded or an error.
     */
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

    /**
     * Gets the current node fee that will be charged on user withdrawals.
     *
     * Example:
     *
     * ```ts
     *
     * const [fee, error] = await TrtlApp.getFee();
     *
     * if (fee) {
     *  console.log(`The current node fee for user withdrawals is: ${fee}`);
     * }
     * ```
     * @returns {Promise<[number | undefined, undefined | ServiceError]>} Returns the withdraw fee in atomic units or an error.
     */
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

    /**
     * Withdraws the specified amount to the user's withdraw address.
     *
     * Example:
     *
     * ```ts
     *
     * const [withdrawal, error] = await TrtlApp.withdraw('8RgwiWmgiYKQlUHWGaTW', 21);
     *
     * if (withdrawal) {
     *  console.log(`Withdrawal request created successfully and is beeing processed, paymentId: ${withdrawal.paymentId}`);
     * }
     * ```
     * @param {string} userId The id of the user withdrawing funds.
     * @param {number} amount The amount to withdraw in atomic units.
     * @param {string} callbackUrl Optional callback URL to send status updates for this withdraw request.
     * @returns {Promise<[WithdrawRequest | undefined, undefined | ServiceError]>} Returns the withdraw request object or an error.
     */
    public static async withdraw(
        userId: string,
        amount: number,
        callbackUrl?: string): Promise<[WithdrawRequest | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}withdraw?appId=${this.appId}&userId=${userId}&amount=${amount}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data as WithdrawRequest, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }
}