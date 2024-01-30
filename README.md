# TooGooToGo-Bot
TooGooToGo-Bot is a tool designed to help you stay informed about the availability of your favorite stores on the Too Good To Go platform. It sends notifications, allowing you to quickly find and purchase food products before they disappear.

## Table of Contents
- [Installation](#installation)
- [Update](#update)
- [Configuration](#configuration)
  - [Discord](#discord)
  - [Telegram](#telegram)
  - [Desktop](#desktop)
  - [Console](#console)
- [Run with Docker](#run-with-docker)
- [Run with PM2](#run-with-pm2)
- [Change Log](#change-log)
- [License](#license)

## Installation
### Prerequisites
- [Node.js](https://nodejs.org) (>=20.x.x)

### Clone the Repository
```bash
git clone https://github.com/Achaak/toogoodtogo-bot.git
cd toogoodtogo-bot/
```

### Configure Environment Variables
1. Make a copy of the sample environment file and enter your parameters:
   ```bash
   cp .env .env.local
   ```
2. Open `.env.local` in a text editor and fill in the required information.

### Install Dependencies
```bash
pnpm install
```

### Build the Project
```bash
pnpm run build
```

### Start the Application
```bash
pnpm start
```

## Update
To update the application, follow these steps:

1. Get the latest files:
   ```bash
   git pull
   ```

2. Install any new dependencies:
   ```bash
   pnpm install
   ```

3. Rebuild the project:
   ```bash
   pnpm run build
   ```

## Configuration
<details>
  <summary>Discord</summary>

  ### Discord
  To set up Discord notifications, access the `.env.local` file in a text editor and provide the necessary value for the `NOTIFICATIONS_DISCORD_ENABLED` parameter.

  #### Creating a Discord Webhook

  1. Create a new Discord server or use an existing one.

  2. Create a new channel

  3. Create a new webhook in the channel settings and copy the URL provided. [See the Discord documentation for more information.](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

  4. Open the `.env.local` file in a text editor and fill in the `NOTIFICATIONS_DISCORD_WEBHOOK_URL` parameter.
</details>

<details>
  <summary>Telegram</summary>

  ### Telegram
  To set up Telegram notifications, access the `.env.local` file in a text editor and provide the necessary value for the `NOTIFICATIONS_TELEGRAM_ENABLED` parameter.

  To configure the bot, open the `.env.local` file in a text editor and specify the value for the `NOTIFICATIONS_TELEGRAM_BOT_TOKEN` parameter.

  #### Creating a Telegram Bot

  1. Open a Telegram chat with [BotFather](https://t.me/BotFather) and enter the **/start** command.

  2. Select the **/newbot** command and follow the instructions to create a new bot. Take note of the token access provided.

  3. Once your bot is created, multiple users can use it to receive notifications about their favorite stocks.

  4. To start receiving notifications, send the **/start** command in your bot's conversation.

  #### Commands
  - **/start**: Starts Telegram notifications
  - **/stop**: Stops Telegram notifications
  - **/help**: Provides a list of usable commands
</details>

<details>
  <summary>Desktop</summary>

  ### Desktop
  To set up desktop notifications, access the `.env.local` file in a text editor and provide the necessary value for the `NOTIFICATIONS_DESKTOP_ENABLED` parameter.
</details>

<details>
  <summary>Console</summary>

  ### Console
  To set up console notifications, access the `.env.local` file in a text editor and provide the necessary value for the `NOTIFICATIONS_CONSOLE_ENABLED` parameter.

  For clearing the console before each notification, open the `.env.local` file in a text editor and specify the value for the `NOTIFICATIONS_CONSOLE_CLEAR` parameter.
</details>

## Run with Docker
You can also run the application using Docker. Follow these steps:

1. Build the Docker image:
   ```bash
   docker build . -t <your desired username>/togoodtogobot
   ```

2. Run the Docker image:
   ```bash
   docker run -p 3000:3000 -d <your desired username>/togoodtogobot
   ```

## Run with PM2
PM2 allows you to install the bot on a server and receive notifications 24/7. Follow these steps:

1. Install PM2:
   ```bash
   pnpm install pm2 -g
   ```

2. Start the server:
   ```bash
   pm2 start start.sh
   ```

3. After logging in:
   ```bash
   pm2 ls # to see the process_id
   pm2 attach your_process_id
   # Press Enter to submit your registration
   ```

## Change Log
See the [CHANGELOG.md](https://github.com/Achaak/toogoodtogo-bot/blob/master/CHANGELOG.md) file for the change log.

## License
This project is licensed under the [MIT License](https://github.com/Achaak/toogoodtogo-bot/blob/master/LICENSE).
