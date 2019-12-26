// import * as crypto from 'crypto';
import axios from 'axios';
import { Account, Deposit, Withdrawal, InitOptions, Transfer, Recipient, AccountsOrderBy } from './Types';
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
     * Creates a new app account.
     *
     * Example:
     *
     * ```ts
     *
     * const [account, error] = await TrtlApp.createAccount();
     *
     * if (account) {
     *  console.log(`New account created with id: ${account.id}`);
     * }
     * ```
     * @returns {Promise<[Account | undefined, undefined | ServiceError]>} Returns the newly created account object or an error.
     */
    public static async createAccount(): Promise<[Account | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/accounts`;

        try {
            const response = await axios.post(endpoint);
            return [(response.data as Account), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Gets an existing app account.
     *
     * Example:
     *
     * ```ts
     *
     * const [account, error] = await TrtlApp.getAccount('8RgwiWmgiYKQlUHWGaTW');
     *
     * if (account) {
     *  console.log(`Account with id: ${account.id} has balance: ${account.balanceUnlocked}`);
     * }
     * ```
     * @param {string} accountId The ID of the account to retrieve.
     * @returns {Promise<[Account | undefined, undefined | ServiceError]>} Returns the account object or an error.
     */
    public static async getAccount(accountId: string): Promise<[Account | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/accounts/${accountId}`;

        try {
            const response = await axios.get(endpoint);
            return [(response.data as Account), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Gets a list of app accounts.
     *
     * Example:
     *
     * ```ts
     *
     * const [accounts, error] = await TrtlApp.getAccounts('createdAt', 25);
     *
     * if (accounts) {
     *  console.log(`Amount of accounts returned: ${accounts.length}`);
     * }
     * ```
     * @param {AccountsOrderBy} orderBy Property to order the accounts by.
     * @param {number} limit The max amount of accounts to retrieve.
     * @param {string} startAfterAccount Only return accounts after this account id, used for pagination.
     * @returns {Promise<[Account[] | undefined, undefined | ServiceError]>} Returns the list of accounts.

       NOTE: disabled this endpoint for now by setting it private
     */
    private static async getAccounts(
        orderBy: AccountsOrderBy = 'createdAt',
        limit?: number,
        startAfterAccount?: string): Promise<[Account[] | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        let endpoint = `${this.apiBase}/${this.appId}/accounts?orderBy=${orderBy}`;

        if (limit) {
            endpoint += `&limit=${limit}`;
        }

        if (startAfterAccount) {
            endpoint += `&startAfter=${startAfterAccount}`;
        }

        try {
            const response = await axios.get(endpoint);
            return [(response.data as Account[]), undefined];
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
     * Sets the withdraw address for an account.
     *
     * Example:
     *
     * ```ts
     *
     * const [address, error] = await TrtlApp.setWithdrawAddress('8RgwiWmgiYKQlUHWGaTW', 'TRTLv32bGBP2cfM3SdijU4TTYnCPoR33g5eTas6n9HamBvu8ozc9BWHZza5j7cmBFSgh4dmmGRongfoEEzcvuAEF8dLxixsS7he');
     *
     * if (address) {
     *  console.log(`account withdraw address successfully set to: ${address}`);
     * }
     * ```
     * @param {string} accountId The id of the account.
     * @param {string} address The address that withdrawals will be sent to for this account.
     * @returns {Promise<[string | undefined, undefined | ServiceError]>} Returns the newly set withdraw address or an error.
     */
    public static async setWithdrawAddress(
        accountId: string,
        address: string): Promise<[string | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/accounts/${accountId}/withdrawaddress`;

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
     * Transfer funds from one account to another.
     *
     * Example:
     *
     * ```ts
     *
     * const [transfer, error] = await TrtlApp.transfer('8RgwiWmgiYKQlUHWGaTW', 'EWshpvxky57RrAeBCf8Z', 42);
     *
     * if (transfer) {
     *  console.log(`account transfer succeeded, transfer id: ${transfer.id}`);
     * }
     * ```
     * @param {string} senderId The id of the account sending the funds.
     * @param {string} receiverId The receiving account's id.
     * @param {number} amount The amount to transfer in atomic units.
     * @returns {Promise<[Transfer | undefined, undefined | ServiceError]>} Returns the transfer object if the transfer succeeded or an error.
     */
    public static async transfer(
        senderId: string,
        receiverId: string,
        amount: number): Promise<[Transfer | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/transfers`;

        const recipients: Recipient[] = [
            { accountId: receiverId, amount: amount }
        ];

        try {
            const response = await axios.post(endpoint, {
                senderId: senderId,
                recipients: recipients
            });
            return [(response.data as Transfer), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Transfer funds from one account to many recipients.
     *
     * Example:
     *
     * ```ts
     *
     * const sender = '8RgwiWmgiYKQlUHWGaTW';
     *
     * const recipients = [
     *  { accountId: 'DawR7cEvQjEWMBVmMkkn', amount: 22 },
     *  { accountId: 'rwszORa1qaSXK0RbZ7F5', amount: 25 }
     * ];
     *
     * const [transfer, error] = await TrtlApp.transferMany(sender, recipients);
     *
     * if (transfer) {
     *  console.log(`account transfer succeeded, transfer id: ${transfer.id}`);
     * }
     * ```
     * @param {string} senderId The id of the account sending the funds.
     * @param {Recipient[]} recipients The array of recipients.
     * @returns {Promise<[Transfer | undefined, undefined | ServiceError]>} Returns the transfer object if the transfer succeeded or an error.
     */
    public static async transferMany(
        senderId: string,
        recipients: Recipient[]): Promise<[Transfer | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/transfers`;

        try {
            const response = await axios.post(endpoint, {
                senderId: senderId,
                recipients: recipients
            });
            return [(response.data as Transfer), undefined];
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
     * @returns {Promise<[Transfer | undefined, undefined | ServiceError]>} Returns the transfer object or an error.
     */
    public static async getTransfer(transferId: string): Promise<[Transfer | undefined, undefined | ServiceError]> {
        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/transfer/${transferId}`;

        try {
            const response = await axios.get(endpoint);
            return [(response.data as Transfer), undefined];
        } catch (error) {
            return [undefined, error.response.data];
        }
    }

    /**
     * Gets the current node fee that will be charged on account withdrawals.
     *
     * Example:
     *
     * ```ts
     *
     * const [fee, error] = await TrtlApp.getFee();
     *
     * if (fee) {
     *  console.log(`The current node fee for account withdrawals is: ${fee}`);
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
     * Withdraws the specified amount from account's balance.
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
     * @param {string} accountId The id of the account withdrawing funds.
     * @param {number} amount The amount to withdraw in atomic units.
     * @param {string} sendAddress Optional address where the funds will be sent, if none is provided the account's withdraw address will be used.
     * @returns {Promise<[Withdrawal | undefined, undefined | ServiceError]>} Returns the withdrawal object or an error.
     */
    public static async withdraw(
        accountId: string,
        amount: number,
        sendAddress?: string): Promise<[Withdrawal | undefined, undefined | ServiceError]> {

        if (!this.initialized) {
            return [undefined, new ServiceError('service/not-initialized')];
        }

        const endpoint = `${this.apiBase}/${this.appId}/withdrawals`;
        const body: any = {
            accountId: accountId,
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
     * @returns {Promise<[Transfer | undefined, undefined | ServiceError]>} Returns the withdrawal object or an error.
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

    // NOTE: disabled the validateWebhookCall helper function for now because of issues related to using
    // the 'crypto' module in frontend frameworks like angular.

    // /**
    //  * Verifies that the webhook call was sent from TRTL apps using your app secret.
    //  *
    //  * Example:
    //  *
    //  * ```ts
    //  *
    //  * const signature = 'SIGNATURE';
    //  * const requestBody: any = {}
    //  *
    //  * const [isValid, error] = await TrtlApp.validateWebhookCall(signature, requestBody);
    //  *
    //  * if (!error) {
    //  *  console.log(`webhook request validation result: ${isValid}`);
    //  * }
    //  * ```
    //  * @param {string} requestSignature This hash signature is passed along with each request in the headers as 'x-trtl-apps-signature'
    //  * @param {string} requestBody The body of the POST request
    //  * @returns {[boolean | undefined, undefined | ServiceError]} Returns a boolean or an error.
    //  */
    // public static validateWebhookCall(
    //     requestSignature: string,
    //     requestBody: any): [boolean | undefined, undefined | ServiceError] {

    //     if (!this.initialized || !this.appSecret) {
    //         return [undefined, new ServiceError('service/not-initialized')];
    //     }

    //     const hash = 'sha256=' + crypto
    //         .createHmac("sha256", this.appSecret)
    //         .update(JSON.stringify(requestBody))
    //         .digest("hex");

    //     const isValid = hash === requestSignature;

    //     return [isValid, undefined];
    // }
}