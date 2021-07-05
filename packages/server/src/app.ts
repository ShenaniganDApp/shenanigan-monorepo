import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import CeramicClient from "@ceramicnetwork/http-client";
import { DID } from "dids";
import { GraphQLError } from "graphql";
import koaPlayground from "graphql-playground-middleware-koa";
import KeyDidResolver from "key-did-resolver";
import Koa, { Request, Response } from "koa";
import bodyParser from "koa-bodyparser";
import graphqlHttp from "koa-graphql";
import graphqlBatchHttpWrapper from "koa-graphql-batch";
import Router from "koa-router";
import mongoose from "mongoose";

import { getContext } from "./graphql/getContext";
import { schema as graphqlSchema } from "./graphql/schema/index";
import { authHandler } from "./middleware/auth";

const app = new Koa();
const router = new Router();

app.use(bodyParser());
// app.use(cors())

/// //////////////////////////
///  CORS Headers         ///
/// //////////////////////////
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Content-Type", "application/json");
  ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ctx.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (ctx.method === "OPTIONS") {
    return ctx.sendStatus(200);
  }
  await next();
  return null;
});

const graphqlSettingsPerReq = async (req: Request, res: Response) => {
  const user = await authHandler(req.header.authorization);

  return {
    graphiql: true,
    schema: graphqlSchema,
    context: await getContext({ user, req }),
    formatError: (error: GraphQLError) => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  } as graphqlHttp.OptionsData;
};

const graphqlServer = graphqlHttp(graphqlSettingsPerReq);

// graphql batch query route
router.all(
  "/graphql/batch",
  bodyParser(),
  graphqlBatchHttpWrapper(graphqlServer)
);
router.all("/graphql", graphqlServer);
router.all(
  "/graphiql",
  koaPlayground({
    endpoint: "/graphql",
    subscriptionEndpoint: "/subscriptions",
  })
);

app.use(router.routes()).use(router.allowedMethods());

/// ////////////////////////////
/// 				Ceramic					 ///
/// ////////////////////////////

const ceramic = new CeramicClient(process.env.CERAMIC_NETWORK);
const resolver = {
  ...KeyDidResolver.getResolver(),
  ...ThreeIdResolver.getResolver(ceramic),
};
const did = new DID({ resolver });

if (did) {
  ceramic.did = did;
  console.log(`Connected to Ceramic at ${process.env.CERAMIC_NETWORK}`);
} else {
  console.log(`Failed to connect to ceramic network `);
}

/// ////////////////////////////
/// Mongo Cluster Connect    ///
/// ////////////////////////////

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dgued.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection Failed");
  });

export { app };
