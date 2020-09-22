# 🤸‍♀️️ Shenanigan Monorepo 🤸‍♀️️

## How to run local

First clone onto your machine and install packages w/ yarn

	git clone https://github.com/ShenaniganDApp/shenanigan-monorepo.git && cd shenanigan-monorepo && yarn

### Contracts

1. Run a testnet
   
    `yarn chain`

2. Deploy contracts
   
    `yarn deploy`

### Server
Make a new `.env` file in the root and copy `env.sample`

1. Build
   
    `yarn server:build`

2. Serve
   
    `yarn server:serve`

#### Note: Until we have hot reloading for babel, you must rerun `yarn server:build` after every change


### App

Fill out the `.env` file with the required information

0. Make sure you have setup a device to run React Native. For more information visit https://reactnative.dev/docs/0.59/running-on-device

1. Run react native metro bundler

    `yarn app:start`

2. Load the schema
   
   `yarn update-schema`

3. Start react native ios or android

	**iOS users run**

    `	yarn app pod install`
	
	then

    `yarn android` || `yarn ios`