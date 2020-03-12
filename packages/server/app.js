const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const graphqlHttp = require('express-graphql');
// const { execute, subscribe } = require('graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const isAuth = require('./middleware/is-auth');
// const { SubscriptionServer } = require('subscriptions-transport-ws');

app.use(bodyParser.json());

/////////////////////////////
///  CORS Headers         ///
/////////////////////////////
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

const graphqlSettingsPerReq = async req => {
  const user = req.user;

  return {
    graphiql: true,
    schema: graphqlSchema,
    context: {
      user,
      req
    },
    // extensions: ({ document, variables, operationName, result }) => {
    // console.log(print(document));
    // console.log(variables);
    // console.log(result);
    // },
    formatError: error => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack
      };
    }
  };
};

app.use('/graphql', graphqlHttp(graphqlSettingsPerReq));

///////////////////////////////
/// Mongo Cluster Connect   ///
///////////////////////////////

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-dgued.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((e) => {
    console.log(e)
    console.log('Connection Failed');
  });

module.exports = app;

  