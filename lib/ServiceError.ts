export type ServiceErrorCode =  'service/unknown-error'               |
                                'service/not-initialized'             |
                                'service/service-halted'              |
                                'service/master-wallet-sync-failed'   |

                                'app/invalid-app-name'                |
                                'app/invalid-app-type'                |
                                'app/app-not-found'                   |
                                'app/app-disabled'                    |
                                'app/create-user-failed'              |
                                'app/user-not-found'                  |
                                'app/invalid-withdraw-address'        |

                                'request/unauthorized'                |
                                'request/invalid-params'              |

                                'transfer/invalid-amount'             |
                                'transfer/insufficient-funds'


export class ServiceError {
  public readonly errorCode: ServiceErrorCode;
  public readonly message: string;

  constructor(errorCode: ServiceErrorCode, customMessage?: string) {
    this.errorCode = errorCode;

    if (customMessage) {
      this.message = customMessage;
    } else {
      this.message = this.getErrorMessage(errorCode);
    }
  }

  getErrorMessage(errorCode: ServiceErrorCode): string {
    switch (errorCode) {
      case 'service/not-initialized':
        return 'Service not initialized';
      case 'service/service-halted':
        return 'Service is currently unavailable, please try again later.'
      case 'service/master-wallet-sync-failed':
        return 'Failed to sync service master wallet.';
      case 'app/invalid-app-name':
        return 'Invalid app name provided.'
      case 'app/invalid-app-type':
        return 'Invalid app type';
      case 'app/app-not-found':
        return 'App not found.';
      case 'app/app-disabled':
        return 'App is currently disabled.';
      case 'app/create-user-failed':
        return 'Failed to create app user.'
      case 'app/user-not-found':
        return 'App user not found';
      case 'app/invalid-withdraw-address':
        return 'User does not have a withdraw address set.';
      case 'request/invalid-params':
        return 'Invalid request parameters provided';
      case 'request/unauthorized':
        return 'Unauthorized request.'
      case 'transfer/insufficient-funds':
        return 'User has insufficient funds for transfer.'
      case 'transfer/invalid-amount':
        return 'Invalid amout specified in transfer request.'
      default:
        return 'An unknown error has occured.';
    }
  }
}
