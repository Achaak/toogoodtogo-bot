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
      radius: 21,
      user_id: userId,
      page_size: 20,
      page: 1,
      discover: false,
      item_categories: [],
      diet_categories: [],
      pickup_earliest: null,
      pickup_latest: null,
      search_phrase: null,
      with_stock_only: false,
      hidden_only: false,
      we_care_only: false,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
