# TooGooToGo-Bot
TooGooToGo-Bot is a tool to warn you about the availability of your favorite stores.
This one will warn you thanks to Telegram or Window notifications.

## Forked with ❤️ for running in container
This fork contains Dockerfile which adds ability to run bot in Docker Container. 

## Building Docker image
Clone the repository and check out the master branch: 
```
git clone https://github.com/Achaak/toogoodtogo-bot.git
```
Enter the repository:
```
cd toogoodtogo-bot/
```
Create Dockerfile or use one in repository:
```
touch Dockerfile
```
Edit Dockerfile with desired text editor (nano in my case):
```
nano Dockerfile
```
Paste folowing and save file:
```
FROM node:16-alpine
WORKDIR /app

# Copy and download dependencies
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Copy sources into image
COPY . .
EXPOSE 3000
CMD yarn start
```
Rename and edit configuration file:
```
cd config/

mv config.default.js config.js

nano config.js
```

Build image:
```
docker build . -t <your desired username>/togoodtogobot
```
Deploy image:
```
docker run -p 3000:3000 -d <your desired username>/togoodtogobot
```

## Running Docker container




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
npm install
// or
yarn
```

Build the project
```js
npm run build
// or
yarn build
```

Start the application:
```js
npm run start
// or
yarn start
```

## Update
Get new files
```
git pull
```
Install new modules
```js
npm install
// or
yarn
```
Rebuild the project
```js
npm run build
// or
yarn build
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

## Change log
[https://github.com/Achaak/toogoodtogo-bot/blob/master/CHANGELOG.md](https://github.com/Achaak/toogoodtogo-bot/blob/master/CHANGELOG.md)


## Credit
https://github.com/marklagendijk/node-toogoodtogo-watcher

Thanks for the API path and some informations.
