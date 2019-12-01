import axios from 'axios';
import { AppUser, Deposit, Withdrawal, InitOptions, UserTransfer, Recipient } from './Types';
import { ServiceError } from './ServiceError';

export class TrtlApp {
    private static apiBase = 'https://trtlapps.io/api';
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
     * @param {string} options Optional initialization parameters.
     */
    public static initialize(appId: string, appSecret: string, options?: InitOptions): void {
        this.appId = appId;
        axios.defaults.headers.common = {'Authorization': `Bearer ${appSecret}`}

        if (options) {
            if (options.apiBase) {
                this.apiBase = options.apiBase;
            }
        }

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

        const endpoint = `${this.apiBase}/${this.appId}/users`;

        try {
            const response = await axios.post(endpoint);
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

        const endpoint = `${this.apiBase}/${this.appId}/users/${userId}`;

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
     * const [deposit, error] = await TrtlApp.requestDeposit('8RgwiWmgiYKQlUHWGaTW', 42);
     *
     * if (deposit) {
     *  console.log(`new deposit request created. qr code: ${deposit.qrCode}`);
     * }
     * ```
     * @param {string} userId The id of the user to create the deposit request for.
     * @param {number} amount The amount the user should deposit in atomic units.
     * @param {string} callbackUrl Optional callback URL to send status updates for this deposit request.
     * @returns {Promise<[Deposit | undefined, undefined | ServiceError]>} Returns the newly created deposit object or an error.
     */
    public static async requestDeposit(
        userId: string,
        amount: number,
        callbackUrl?: string): Promise<[Deposit | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/deposits`;
        const body: any = {
            userId: userId,
            amount: amount
        }

        if (callbackUrl) {
            body.callbackUrl = callbackUrl;
        }

        try {
            const response = await axios.post(endpoint, body);
            return [response.data as Deposit, undefined];
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

        const endpoint = `${this.apiBase}/${this.appId}/users/${userId}/withdrawaddress`;

        try {
            const response = await axios.put(endpoint, {
                address: address
            });
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
     * const [transfer, error] = await TrtlApp.transfer('8RgwiWmgiYKQlUHWGaTW', 'EWshpvxky57RrAeBCf8Z', 42);
     *
     * if (transfer) {
     *  console.log(`user transfer succeeded, transfer id: ${transfer.id}`);
     * }
     * ```
     * @param {string} senderId The id of the user sending the funds.
     * @param {string} receiverId The receiving user's id.
     * @param {number} amount The amount to transfer in atomic units.
     * @returns {Promise<[UserTransfer | undefined, undefined | ServiceError]>} Returns the transfer object if the transfer succeeded or an error.
     */
    public static async transfer(
        senderId: string,
        receiverId: string,
        amount: number): Promise<[UserTransfer | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/transfers`;

        const recipients: Recipient[] = [
            { userId: receiverId, amount: amount }
        ];

        try {
            const response = await axios.post(endpoint, {
                senderId: senderId,
                recipients: recipients
            });
            return [(response.data as UserTransfer), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Transfer funds from one user to many recipients.
     *
     * Example:
     *
     * ```ts
     *
     * const sender = '8RgwiWmgiYKQlUHWGaTW';
     *
     * const recipients = [
     *  { userId: 'DawR7cEvQjEWMBVmMkkn', amount: 22 },
     *  { userId: 'rwszORa1qaSXK0RbZ7F5', amount: 25 }
     * ];
     *
     * const [transfer, error] = await TrtlApp.transferMany(sender, recipients);
     *
     * if (transfer) {
     *  console.log(`user transfer succeeded, transfer id: ${transfer.id}`);
     * }
     * ```
     * @param {string} senderId The id of the user sending the funds.
     * @param {Recipient[]} recipients The array of recipients.
     * @returns {Promise<[UserTransfer | undefined, undefined | ServiceError]>} Returns the transfer object if the transfer succeeded or an error.
     */
    public static async transferMany(
        senderId: string,
        recipients: Recipient[]): Promise<[UserTransfer | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/transfers`;

        try {
            const response = await axios.post(endpoint, {
                senderId: senderId,
                recipients: recipients
            });
            return [(response.data as UserTransfer), undefined];
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

        const endpoint = `${this.apiBase}/service/nodefee`;

        try {
            const response = await axios.get(endpoint);
            return [response.data.fee as number, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Withdraws the specified amount from user's balance.
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
     * @param {string} sendAddress Optional address where the funds will be sent, if none is provided the user's withdraw address will be used.
     * @param {string} callbackUrl Optional callback URL to send status updates for this withdraw request.
     * @returns {Promise<[Withdrawal | undefined, undefined | ServiceError]>} Returns the withdrawal object or an error.
     */
    public static async withdraw(
        userId: string,
        amount: number,
        sendAddress?: string,
        callbackUrl?: string): Promise<[Withdrawal | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/withdrawals`;
        const body: any = {
            userId: userId,
            amount: amount
        }

        if (sendAddress) {
            body.sendAddress = sendAddress
        }

        if (callbackUrl) {
            body.callbackUrl = callbackUrl
        }

        try {
            const response = await axios.post(endpoint, body);
            return [response.data as Withdrawal, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }
}