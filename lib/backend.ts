export class Backend {

    private apiBase: string;

    constructor(apiBase: string) {
        this.apiBase = apiBase;
    }

    public helloWorld(): string {
        return `hello from node backend! apiBase: ${this.apiBase}`;
    }
}