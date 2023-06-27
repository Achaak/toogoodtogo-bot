import { api } from "./config.js";
import { env } from './../../env/server.js';

export const authByEmail = () =>
  api.post<{
    state: string;
    polling_id: string;
  }>("auth/v3/authByEmail", {
    json: {
      device_type: "ANDROID",
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
  }>("auth/v3/authByRequestPollingId", {
    json: {
      device_type: "ANDROID",
      email: env.CREDENTIAL_EMAIL,
      request_polling_id: polling_id,
    },
  });

export const refresh = ({ refreshToken }: { refreshToken: string }) =>
  api.post<{
    access_token: string;
    refresh_token: string;
  }>("auth/v3/token/refresh", {
    json: {
      device_type: "ANDROID",
      refresh_token: refreshToken,
    },
  });
