import * as crypto from 'crypto';
import axios from 'axios';
import { AppUser, Deposit, Withdrawal, InitOptions, UserTransfer, Recipient, UsersOrderBy } from './Types';
import { ServiceError } from './ServiceError';

export class TrtlApp {
    private static apiBase = 'https://trtlapps.io/api';
    private static initialized: boolean = false;
    private static appId: string | undefined;
    private static appSecret: string | undefined;

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
        this.appId      = appId;
        this.appSecret  = appSecret;

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
     * const [user, error] = await TrtlApp.createUser();
     *
     * if (user) {
     *  console.log(`New user created with id: ${user.userId}`);
     * }
     * ```
     * @returns {Promise<[AppUser | undefined, undefined | ServiceError]>} Returns the newly created user object or an error.
     */
    public static async createUser(): Promise<[AppUser | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/users`;

        try {
            const response = await axios.post(endpoint);
            return [(response.data as AppUser), undefined];
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
     * Gets a list of app users.
     *
     * Example:
     *
     * ```ts
     *
     * const [users, error] = await TrtlApp.getUsers('createdAt', 25);
     *
     * if (users) {
     *  console.log(`Amount of users returned: ${users.length}`);
     * }
     * ```
     * @param {UsersOrderBy} orderBy Property to order the users by.
     * @param {number} limit The max amount of users to retrieve.
     * @param {string} startAfterUser Only return users after this user id, used for pagination.
     * @returns {Promise<[AppUser[] | undefined, undefined | ServiceError]>} Returns the list of users.

       NOTE: disabled this endpoint for now by setting it private
     */
    private static async getUsers(
        orderBy: UsersOrderBy = 'createdAt',
        limit?: number,
        startAfterUser?: string): Promise<[AppUser[] | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        let endpoint = `${this.apiBase}/${this.appId}/users?orderBy=${orderBy}`;

        if (limit) {
            endpoint += `&limit=${limit}`;
        }

        if (startAfterUser) {
            endpoint += `&startAfter=${startAfterUser}`;
        }

        try {
            const response = await axios.get(endpoint);
            return [(response.data as AppUser[]), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Gets an app deposit with the given ID.
     *
     * Example:
     *
     * ```ts
     *
     * const [deposit, error] = await TrtlApp.getDeposit('AE3AI1GNcOOz1qIz7rS1');
     *
     * if (deposit) {
     *  console.log(`Retrieved deposit with ID: ${deposit.id}`);
     * }
     * ```
     * @param {string} depositId The ID of the deposit to retrieve.
     * @returns {Promise<[Deposit | undefined, undefined | ServiceError]>} Returns the deposit object or an error.
     */
    public static async getDeposit(depositId: string): Promise<[Deposit | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/deposits/${depositId}`;

        try {
            const response = await axios.get(endpoint);
            return [(response.data as Deposit), undefined];
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
     * Gets an app transfer with the given ID.
     *
     * Example:
     *
     * ```ts
     *
     * const [transfer, error] = await TrtlApp.getDeposit('BxPoD2A7uyxZyMdl6ojn');
     *
     * if (transfer) {
     *  console.log(`Retrieved transfer with ID: ${transfer.id}`);
     * }
     * ```
     * @param {string} transferId The ID of the transfer to retrieve.
     * @returns {Promise<[UserTransfer | undefined, undefined | ServiceError]>} Returns the transfer object or an error.
     */
    public static async getTransfer(transferId: string): Promise<[UserTransfer | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/transfer/${transferId}`;

        try {
            const response = await axios.get(endpoint);
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
     * @returns {Promise<[Withdrawal | undefined, undefined | ServiceError]>} Returns the withdrawal object or an error.
     */
    public static async withdraw(
        userId: string,
        amount: number,
        sendAddress?: string): Promise<[Withdrawal | undefined, undefined | ServiceError]> {

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

        try {
            const response = await axios.post(endpoint, body);
            return [response.data as Withdrawal, undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Gets a withdrawal with the given ID.
     *
     * Example:
     *
     * ```ts
     *
     * const [withdrawal, error] = await TrtlApp.getWithdrawal('KTZ0ATzCUwgR6PMES0iD');
     *
     * if (withdrawal) {
     *  console.log(`Retrieved withdrawal with ID: ${withdrawal.id}`);
     * }
     * ```
     * @param {string} withdrawalId The ID of the withdrawal to retrieve.
     * @returns {Promise<[UserTransfer | undefined, undefined | ServiceError]>} Returns the withdrawal object or an error.
     */
    public static async getWithdrawal(withdrawalId: string): Promise<[Withdrawal | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/withdrawals/${withdrawalId}`;

        try {
            const response = await axios.get(endpoint);
            return [(response.data as Withdrawal), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Verifies that the webhook call was sent from TRTL apps using your app secret.
     *
     * Example:
     *
     * ```ts
     *
     * const signature = 'SIGNATURE';
     * const requestBody: any = {}
     *
     * const [isValid, error] = await TrtlApp.validateWebhookCall(signature, requestBody);
     *
     * if (!error) {
     *  console.log(`webhook request validation result: ${isValid}`);
     * }
     * ```
     * @param {string} requestSignature This hash signature is passed along with each request in the headers as 'x-trltapps-signature'
     * @param {string} requestBody The body of the POST request
     * @returns {[boolean | undefined, undefined | ServiceError]} Returns a boolean or an error.
     */
    public static validateWebhookCall(
        requestSignature: string,
        requestBody: any): [boolean | undefined, undefined | ServiceError] {

        if (!this.initialized || !this.appSecret) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const hash = 'sha256=' + crypto
            .createHmac("sha256", this.appSecret)
            .update(JSON.stringify(requestBody))
            .digest("hex");

        const isValid = hash === requestSignature;

        return [isValid, undefined];
    }
}