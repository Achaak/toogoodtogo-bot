import { api } from "./config.js";

export const getFavorite = ({
  userId,
  accessToken,
}: {
  userId: number;
  accessToken: string;
}) =>
  api.post("item/v7/", {
    json: {
      favorites_only: true,
      origin: {
        latitude: 48.85332,
        longitude: 2.34885,
      },
      radius: 200,
      user_id: userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
