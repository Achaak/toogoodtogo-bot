import { api } from "./config.js";
import Config from "../../../config/config.js";

export const authByEmail = () =>
  api.post<{
    polling_id: string;
  }>("auth/v3/authByEmail", {
    json: {
      device_type: "IOS",
      email: Config.api.credentials.email,
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
      device_type: "IOS",
      email: Config.api.credentials.email,
      request_polling_id: polling_id,
    },
  });

export const refresh = ({ refreshToken }: { refreshToken: string }) =>
  api.post<{
    access_token: string;
    refresh_token: string;
  }>("auth/v3/token/refresh", {
    json: {
      refresh_token: refreshToken,
    },
  });
