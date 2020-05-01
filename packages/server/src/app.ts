import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
// import { execute, subscribe } from 'graphql');
import mongoose from 'mongoose';
import {schema as graphqlSchema} from './graphql/schema/index';
import isAuth from './middleware/is-auth';
import * as loaders from './graphql/loaders';
import { Loaders } from './graphql/nodeInterface';
// import { SubscriptionServer } from 'subscriptions-transport-ws');
const app = express();

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
  const isAuth = req.isAuth

  const AllLoaders: Loaders = loaders;

  const dataloaders = Object.keys(AllLoaders).reduce(
    (acc, loaderKey) => ({
      ...acc,
      [loaderKey]: AllLoaders[loaderKey].getLoader(),
    }),
    {},
  );

  return {
    graphiql: true,
    schema: graphqlSchema,
    context: {
      user,
      isAuth,
      req,
      dataloaders
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

export default app;

  