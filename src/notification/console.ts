import { clear } from 'console';
import { env } from '../env/server.js';
import type { ItemFavorite } from '../types/favorite.js';
import { type Notification } from '../types/notification.js';
import { formatPickupInterval } from '../utils/date.js';
import { formatCurrency } from '../utils/currency.js';

export class Console {
  send(notification: Notification) {
    switch (notification.type) {
      case 'allFavorite':
        this.sendAllFavorite(notification.data);
        break;
    }
  }

  private sendAllFavorite(data: ItemFavorite[]) {
    this.sendMessage(
      createStringTable({
        head: ['Name', 'Available', 'Price', 'Pick up'],
        data: data.map((item) => [
          item.display_name,
          item.items_available.toString(),
          formatCurrency(
            item.item.price_including_taxes.minor_units,
            item.item.price_including_taxes.decimals,
            item.item.price_including_taxes.code
          ),
          formatPickupInterval(item.pickup_interval),
        ]),
      })
    );
  }

  private sendMessage(data: string) {
    if (env.NOTIFICATIONS_CONSOLE_CLEAR === 'true') {
      clear();
    } else {
      console.log('--------------------');
    }
    console.log(data);
  }
}

const createStringTable = ({
  head,
  data,
}: {
  head: string[];
  data: string[][];
}): string => {
  const maxLengths = data.length
    ? head.map((_, i) =>
        Math.max(...data.map((d) => d[i].length), head[i].length)
      )
    : head.map((h) => h.length);
  const headString = head
    .map((h, i) => h.padEnd(maxLengths[i], '\u00A0'))
    .join(' | ');
  const separator = head.map((_, i) => '-'.repeat(maxLengths[i])).join('-+-');
  const dataString = data
    .map((d) => d.map((s, i) => s.padEnd(maxLengths[i], '\u00A0')).join(' | '))
    .join('\n');
  return `${headString}\n${separator}\n${dataString}`;
};
