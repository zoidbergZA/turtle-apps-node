export class TurtleApps {

    private apiBase = 'https://trtlapps.io/api/';
    private initialized: boolean;
    private appId: string | undefined;
    private appSecret: string | undefined;

    constructor(appId: string, appSecret: string) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.initialized = true;
    }

    public initialize(appId: string, appSecret: string): void {
        this.appId = appId;
        this.appSecret = appSecret;
        this.initialized = true;
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    public getAppId(): string | undefined {
        return this.appId;
    }

    public createUser(): string | null {
        if (!this.initialized) {
            return null;
        }

        const endpoint = `${this.apiBase}/createuser/?appId=${this.appId}`;

        return null;
    }
}