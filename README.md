# TooGooToGo-Bot
TooGooToGo-Bot is a tool that notifies you about the availability of your favorite stores. It sends notifications through Telegram or Windows notifications.

## Installation
Download and install the latest version of Node.js from https://nodejs.org/en/download.

Please note that the provided link directs you to the Node.js downloads page, where you can select the appropriate installer for your operating system and follow the installation instructions.

Clone the repository and check out the master branch: 
```bash
git clone https://github.com/Achaak/toogoodtogo-bot.git
```

Enter the repository:
```bash
cd toogoodtogo-bot/
```

Make a copy of the sample environment file and enter your parameters:
```bash
cp .env .env.local
```

Install the application dependencies:
```bash
yarn
```

Build the project:
```bash
yarn build
```

Start the application:
```bash
yarn start
```

## Update
To update the application, follow these steps:

Get the latest files:
```bash
git pull
```

Install any new dependencies:
```bash
yarn
```

Rebuild the project:
```bash
yarn build
```

## Run with Docker
You can also run the application using Docker. Follow these steps:

Build the Docker image:
```bash
docker build . -t <your desired username>/togoodtogobot
```

Run the Docker image:
```bash
docker run -p 3000:3000 -d <your desired username>/togoodtogobot
```


## Configuring Telegram notifications
To configure Telegram notifications, follow these steps:

1. Open a Telegram chat with BotFather and enter the **/start** command.

2. Select the **/newbot** command and follow the instructions to create a new bot. Take note of the token access provided.

3. Once your bot is created, multiple users can use it to receive notifications about their favorite stocks.
   
4. To start receiving notifications, send the **/start** command in your bot's conversation.

### Commands
- **/start**: Starts Telegram notifications
- **/stop**: Stops Telegram notifications
- **/help**: Provides a list of usable commands

## PM2 configuration
PM2 allows you to install the bot on a server and receive notifications 24/7. Follow these steps:

Install PM2
```bash
npm install pm2 -g
```

Start the server
```bash
pm2 start start.sh
```

After logging in:
```bash
pm2 ls # to see the process_id
pm2 attach your_process_id
# Press Enter to submit your registration
```

## Change log
See the [CHANGELOG.md](https://github.com/Achaak/toogoodtogo-bot/blob/master/CHANGELOG.md) file for the change log.


## Credit
Thanks to [node-toogoodtogo-watcher](https://github.com/marklagendijk/node-toogoodtogo-watcher) for providing the API path and some information.
