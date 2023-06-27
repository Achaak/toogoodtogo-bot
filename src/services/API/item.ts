import { Favorite } from "./../../types/favorite.js";
import { API_ITEM_ENDPOINT, DEVICE_TYPE, api } from "./config.js";

export const getFavorite = ({
  userId,
  accessToken,
}: {
  userId: number;
  accessToken: string;
}) =>
  api.post<{ items: Favorite[] }>(API_ITEM_ENDPOINT, {
    json: {
      favorites_only: true,
      origin: {
        latitude: 48.85332,
        longitude: 2.34885,
      },
      radius: 200,
      user_id: userId,
      device_type: DEVICE_TYPE,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
