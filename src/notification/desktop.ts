import notifier from 'node-notifier';
import type { Notification } from '../types/notification.js';

export class Desktop {
  send(notification: Notification) {
    switch (notification.type) {
      case 'newFavoriteAvailable':
        this.sendNewFavoriteAvailable(notification);
        break;
    }
  }

  private sendNewFavoriteAvailable(notification: Notification) {
    for (const item of notification.data) {
      notifier.notify({
        title: 'New stocks available',
        message: `${item.display_name} - ${item.items_available} available`,
        icon: item.item.cover_picture.current_url,
      });
    }
  }
}
