export type ServiceErrorCode =  'service/unknown-error' |
                                'service/not-initialized'

export class ServiceError {
    public readonly errorCode: ServiceErrorCode;
    public readonly message: string;

    constructor(errorCode: ServiceErrorCode, customMessage?: string) {
        this.errorCode = errorCode;

        if (customMessage !== undefined) {
            this.message = customMessage;
        } else {
            this.message = this.getMessage(errorCode);
        }
    }

    private getMessage(errorCode: ServiceErrorCode): string {
        switch (errorCode) {
            case 'service/not-initialized':
                return 'The service has not yet been initialized.';
            default:
                return 'An unknown error occured.';
        }
    }
}