# TooGooToGo-Bot
TooGooToGo-Bot is a tool to warn you about the availability of your favorite stores.
This one will warn you thanks to Telegram or Window notifications.

## Installation
Download and install the latest Node.js version:
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
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

Make a copy of the config sample file and insert your parameters: 
```
cd config && cp config.default.js config.js
```

Return at the root
```
cd ..
```

Install the application:
```js
yarn
```

Build the project
```js
yarn build
```

Start the application:
```js
yarn start
```

## Update
Get new files
```
git pull
```
Install new modules
```js
yarn
```
Rebuild the project
```js
yarn build
```

## Run with Docker
Build image:
```
docker build . -t <your desired username>/togoodtogobot
```

Run image:
```
docker run -p 3000:3000 -d <your desired username>/togoodtogobot
```


## Configuring Telegram notifications
1. Open a Telegram chat with BotFather and click the **/start** command.

2. Select the command **/newbot** and follow the instruction.

3. After created the bot. Take the token access and put in the config file.

4. Your bot is now ready. Multiple user can use it to get your favorite stocks avalaible.

5. Now, to start the notifications, send **/start** in your bot's conversation.

### Commands
```js
/start // Starts Telegram notifications
/stop  // Stops Telegram notifications
/help  // Gives usable commands
```

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

After you logged
```
pm2 ls # to see process_id
pm2 attach your_process_id
# press enter to submit your registration
```

## Change log
[https://github.com/Achaak/toogoodtogo-bot/blob/master/CHANGELOG.md](https://github.com/Achaak/toogoodtogo-bot/blob/master/CHANGELOG.md)


## Credit
https://github.com/marklagendijk/node-toogoodtogo-watcher

Thanks for the API path and some informations.
