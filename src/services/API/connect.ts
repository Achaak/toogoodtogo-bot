import { AUTH_BY_EMAIL_ENDPOINT, AUTH_POLLING_ENDPOINT, DEVICE_TYPE, REFRESH_ENDPOINT, api } from "./config.js";
import { env } from './../../env/server.js';

export const authByEmail = () =>
  api.post<{
    state: string;
    polling_id: string;
  }>(AUTH_BY_EMAIL_ENDPOINT, {
    json: {
      device_type: DEVICE_TYPE,
      email: env.CREDENTIAL_EMAIL,
    },
  });

export const authByRequestPollingId = ({
  polling_id,
}: {
  polling_id: string;
}) =>
  api.post<{
    access_token: string;
    refresh_token: string;
    startup_data: { user: { user_id: number } };
  }>(AUTH_POLLING_ENDPOINT, {
    json: {
      device_type: DEVICE_TYPE,
      email: env.CREDENTIAL_EMAIL,
      request_polling_id: polling_id,
    },
  });

export const refresh = ({ refreshToken }: { refreshToken: string }) =>
  api.post<{
    access_token: string;
    refresh_token: string;
  }>(REFRESH_ENDPOINT, {
    json: {
      device_type: DEVICE_TYPE,
      refresh_token: refreshToken,
    },
  });
