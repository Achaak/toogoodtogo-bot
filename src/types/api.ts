import type { ItemFavorite } from './favorite';

export type ApiParams = {
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

export type ApiLogin = {
  state: string;
  polling_id: string;
};

export type ApiRefresh = {
  access_token: string;
  refresh_token: string;
};

export type ApiAuthPolling = {
  status: number;
  access_token: string;
  refresh_token: string;
  startup_data: {
    user: {
      user_id: string;
    };
  };
};

export type ApiItems = {
  items: ItemFavorite[];
};
