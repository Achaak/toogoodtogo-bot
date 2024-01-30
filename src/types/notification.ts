import { type ItemFavorite } from './favorite';

interface NotificationBase {
  type: 'allFavorite' | 'newFavoriteAvailable';
}

export interface NotificationAllFavorite extends NotificationBase {
  type: 'allFavorite';
  data: ItemFavorite[];
}

export interface NotificationNewFavoriteAvailable extends NotificationBase {
  type: 'newFavoriteAvailable';
  data: ItemFavorite[];
}

export type Notification =
  | NotificationAllFavorite
  | NotificationNewFavoriteAvailable;
