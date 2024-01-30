import { formatPickupInterval } from '../utils/date.js';
import { env } from '../env/server.js';
import { type Notification } from '../types/notification.js';
import { WebhookClient } from 'discord.js';
import { formatCurrency } from '../utils/currency.js';

export class Discord {
  private webhookClient = new WebhookClient({
    url: env.NOTIFICATIONS_DISCORD_WEBHOOK_URL,
  });

  send(notification: Notification) {
    switch (notification.type) {
      case 'newFavoriteAvailable':
        this.sendNewFavoriteAvailable(notification);
        break;
    }
  }

  sendNewFavoriteAvailable(notification: Notification) {
    for (const item of notification.data) {
      void this.webhookClient
        .send({
          embeds: [
            {
              title: 'New stocks available',
              description: item.display_name,
              thumbnail: {
                url: item.item.cover_picture.current_url,
              },
              fields: [
                {
                  name: 'Available',
                  value: item.items_available.toString(),
                  inline: true,
                },
                {
                  name: 'Price',
                  value: formatCurrency(
                    item.item.price_including_taxes.minor_units,
                    item.item.price_including_taxes.decimals,
                    item.item.price_including_taxes.code
                  ),
                  inline: true,
                },
                {
                  name: 'Picked up',
                  value: formatPickupInterval(item.pickup_interval),
                  inline: true,
                },
              ],
            },
          ],
          content: item.display_name,
          username: 'Stock Alert',
          avatarURL: item.item.cover_picture.current_url,
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}
