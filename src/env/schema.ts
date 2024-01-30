import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  PORT: z.string(),
  CREDENTIAL_EMAIL: z.string(),
  GET_ITEMS_INTERVAL_IN_MS: z.string(),
  AUTHENTICATION_INTERVAL_IN_MS: z.string(),
  NOTIFICATIONS_CONSOLE_CLEAR: z.string(),
  NOTIFICATIONS_CONSOLE_ENABLED: z.string(),
  NOTIFICATIONS_DESKTOP_ENABLED: z.string(),
  NOTIFICATIONS_TELEGRAM_ENABLED: z.string(),
  NOTIFICATIONS_TELEGRAM_BOT_TOKEN: z.string(),
  NOTIFICATIONS_DISCORD_ENABLED: z.string(),
  NOTIFICATIONS_DISCORD_WEBHOOK_URL: z.string(),
  LOCALE: z.string(),
  TIMEZONE: z.string(),
});
