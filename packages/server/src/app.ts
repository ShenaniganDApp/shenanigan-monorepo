import 'isomorphic-fetch';

import Koa, { Request } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import graphqlHttp from 'koa-graphql';
import Router from 'koa-router';
import koaPlayground from 'graphql-playground-middleware-koa';
import graphqlBatchHttpWrapper from 'koa-graphql-batch';
import mongoose from 'mongoose';

import { schema as graphqlSchema } from './graphql/schema/index';
import { getUser } from './helpers/auth';
import * as loaders from './graphql/loaders';
import { Loaders } from './graphql/nodeInterface';

const app = new Koa();
const router = new Router();

app.use(bodyParser());
// app.use(cors())

/////////////////////////////
///  CORS Headers         ///
/////////////////////////////
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Content-Type', 'application/json');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (ctx.method === 'OPTIONS') {
    return ctx.sendStatus(200);
  }
  await next();
});


const graphqlSettingsPerReq = async (req: Request) => {
  const token = req.headers.authorization.split(' ')[1];
  const user = getUser(token);

  const AllLoaders: Loaders = loaders;

  const dataloaders = Object.keys(AllLoaders).reduce(
    (acc, loaderKey) => ({
      ...acc,
      [loaderKey]: AllLoaders[loaderKey].getLoader(),
    }),
    {}
  );

  return {
    graphiql: true,
    schema: graphqlSchema,
    context: {
      user,
      req,
      dataloaders,
    },
    // extensions: ({ document, variables, operationName, result }) => {
    // console.log(print(document));
    // console.log(variables);
    // console.log(result);
    // },
    formatError: (error) => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = graphqlHttp(graphqlSettingsPerReq);

// graphql batch query route
router.all(
  '/graphql/batch',
  bodyParser(),
  graphqlBatchHttpWrapper(graphqlServer)
);
router.all('/graphql', graphqlServer);
router.all(
  '/graphiql',
  koaPlayground({
    endpoint: '/graphql',
    subscriptionEndpoint: '/subscriptions',
  })
);

app.use(router.routes()).use(router.allowedMethods());

///////////////////////////////
/// Mongo Cluster Connect   ///
///////////////////////////////

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dgued.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((e) => {
    console.log(e);
    console.log('Connection Failed');
  });

export default app;
