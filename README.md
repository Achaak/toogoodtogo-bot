# TooGooToGo-Bot
TooGooToGo-Bot is a tool that notifies you about the availability of your favorite stores. It sends notifications through Telegram or Windows notifications.

## Table of Contents
- [TooGooToGo-Bot](#toogootogo-bot)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Configure Environment Variables](#configure-environment-variables)
    - [Install Dependencies](#install-dependencies)
    - [Build the Project](#build-the-project)
    - [Start the Application](#start-the-application)
  - [Update](#update)
  - [Run with Docker](#run-with-docker)
  - [Configuring Telegram Notifications](#configuring-telegram-notifications)
    - [Commands](#commands)
  - [PM2 Configuration](#pm2-configuration)
  - [Change Log](#change-log)
  - [Credits](#credits)
  - [License](#license)

## Introduction
TooGooToGo-Bot is a tool designed to help you stay updated on the availability of your favorite stores on the Too Good To Go platform. It provides notifications through Telegram or Windows notifications, allowing you to quickly find and purchase food items before they are gone.

## Installation
### Prerequisites
- [Node.js](https://nodejs.org) (>=16.x.x)

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
yarn install
```

### Build the Project
```bash
yarn run build
```

### Start the Application
```bash
yarn start
```

## Update
To update the application, follow these steps:

1. Get the latest files:
   ```bash
   git pull
   ```

2. Install any new dependencies:
   ```bash
   yarn install
   ```

3. Rebuild the project:
   ```bash
   yarn run build
   ```

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

## Configuring Telegram Notifications
To configure Telegram notifications, follow these steps:

1. Open a Telegram chat with [BotFather](https://t.me/BotFather) and enter the **/start** command.

2. Select the **/newbot** command and follow the instructions to create a new bot. Take note of the token access provided.

3. Once your bot is created, multiple users can use it to receive notifications about their favorite stocks.

4. To start receiving notifications, send the **/start** command in your bot's conversation.

### Commands
- **/start**: Starts Telegram notifications
- **/stop**: Stops Telegram notifications
- **/help**: Provides a list of usable commands

## PM2 Configuration
PM2 allows you to install the bot on a server and receive notifications 24/7. Follow these steps:

1. Install PM2:
   ```bash
   yarn install pm2 -g
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

## Credits
Thanks to [node-toogoodtogo-watcher](https://github.com/marklagendijk/node-toogoodtogo-watcher) for providing the API path and some information.

## License
This project is licensed under the [MIT License](https://github.com/Achaak/toogoodtogo-bot/blob/master/LICENSE).