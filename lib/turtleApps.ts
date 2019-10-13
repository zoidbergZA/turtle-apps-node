import axios from 'axios';
import { AppUser } from './types';
import { ServiceError } from './serviceError';

export class TurtleApps {

    private apiBase = 'https://trtlapps.io/api/';
    private initialized: boolean;
    private appId: string | undefined;

    constructor(appId: string, appSecret: string) {
        this.appId = appId;
        this.initialized = true;
        axios.defaults.headers.common = {'Authorization': `Bearer ${appSecret}`}
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

        const endpoint = `${this.apiBase}createuser/?appId=${this.appId}`;

        try {
            const response = await axios.get(endpoint);
            return [response.data as AppUser, undefined];
        } catch (error) {
            return [undefined, new ServiceError('service/unknown-error')];
        }
    }
}