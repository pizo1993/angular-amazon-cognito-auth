import { CREDS } from './creds';
export const environment = {
  production: true,
  cognitoPool: {
    UserPoolId: CREDS.USER_POOL_ID,
    ClientId: CREDS.CLIENT_ID
  }
};
