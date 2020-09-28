# TooGooToGo-Bot
Machin is a tool to warn you about the availability of your favorite stores.
This one will warn you thanks to Telegram or Window notifications.

## Installation
Download and install the latest Node.js version:
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
```
Clone the repository and check out the master branch: 
```
git clone https://github.com/Achaak/toogoodtogo-bot.git
```

Enter the repository:
```
cd toogoodtogo-bot/
```

Install the application:
```
npm install
```

Make a copy of the config sample file and insert your parameters: 
```
cp config.default.js config.js
```

Start the application:
```
npm run start
```

## Configuring Telegram notifications
Open a Telegram chat with BotFather and click the /start command.

Select the command /newbot and follow the instruction.

After created the bot. Take the token access and put in the config file.

Your bot is now ready. Multiple user can use it to get your favorite stocks avalaible.

## PM2 configuration
PM2 will allow you to install the bot on a server and be notified 24/7.

Install PM2
```
npm install pm2 -g
```

Start the server
```
pm2 start start.sh
```


## Credit
https://github.com/marklagendijk/node-toogoodtogo-watcher

Thanks for the API path and some informations.