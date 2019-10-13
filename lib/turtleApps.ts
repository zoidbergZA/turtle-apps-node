export class TurtleApps {

    private initialized: boolean;
    private apiBase: string;
    private appId: string | undefined;
    private appSecret: string | undefined;

    constructor(apiBase: string) {
        this.apiBase = apiBase;
        this.initialized = false;
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

    public helloWorld(): string {
        return `hello from node backend! apiBase: ${this.apiBase}`;
    }
}