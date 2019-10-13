import axios from 'axios';

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

    public async createUser(): Promise<any> {
        if (!this.initialized) {
            return Promise.reject('apps backend not initialized!');
        }

        const endpoint = `${this.apiBase}createuser/?appId=${this.appId}`;

        try {
            const response = await axios.get(endpoint);
            return Promise.resolve(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}