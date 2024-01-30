import { env } from '../env/server.js';

const hourFormatter = new Intl.DateTimeFormat(env.LOCALE, {
  hour: 'numeric',
  minute: 'numeric',
  timeZone: env.TIMEZONE,
});

const dayFormatter = new Intl.DateTimeFormat(env.LOCALE, {
  timeZone: env.TIMEZONE,
});

export const formatPickupInterval = ({
  start,
  end,
}: {
  start: string;
  end: string;
}) => {
  const prefix =
    dayFormatter.format(new Date(start)) === dayFormatter.format(new Date())
      ? 'Today'
      : 'Tomorrow';

  return `${prefix} ${hourFormatter.format(new Date(start))} - ${hourFormatter.format(
    new Date(end)
  )}`;
};
