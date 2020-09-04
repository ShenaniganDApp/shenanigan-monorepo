# Shenanigan App

The Shenanigan app written with react native and relay

## How to run local

1. Clone onto your machine

    `git clone https://github.com/ShenaniganDApp/app.git` 
  
2. Install packages with yarn

    `yarn`
    
3. Run a Ganache devchain
    
    `yarn ganache`

4. Compile and migrate contracts
    
    `truffle compile && truffle migrate --reset`

5. Create a new `.env` file in the root directory and make it like the example:
 ```
    NODE_ENV=development
    PORT=8081 
    GRAPHQL_URL=http://192.168.42.179:8080/graphql  //replace with computer IP
    SUBSCRIPTION_URL=ws://192.168.42.179:5000/subscriptions //replace with computer IP
    DEV_TOKEN= *Insert generated JWT Token*
```
    
6. Run react native metro bundler

    `yarn start`
    
7. Start react native ios or android
      
     `yarn android` || `yarn ios`


## Contribution

Master branch is locked. Fork the repo from development and submit a pull request. Make sure you rebase before submitting pull request and squash your commits so the git history stays clean :)

Also THANK YOU!!!


