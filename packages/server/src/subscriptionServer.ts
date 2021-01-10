import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { schema } from "./graphql/schema/index";
import { authHandler } from "./middleware/auth";
import {getContext} from "./graphql/getContext";

const WS_PORT = 5000;

type ConnectionParams = {
  authorization?: string;
};

export default graphQLServer => {
  // Create WebSocket listener server
  const websocketServer = createServer(graphQLServer.callback());

  // Bind it to port and start listening
  websocketServer.listen(WS_PORT, () => {
    console.log(
      `Websocket Server is now running on http://localhost:${WS_PORT}`
    );
    new SubscriptionServer(
      {
        onConnect: async (connectionParams: ConnectionParams) => {
          console.log('connectionParams: ', connectionParams);
          const user = await authHandler(connectionParams.authorization);
  
          return await getContext({ user });
        },
        onDisconnect: () => console.log('Client subscription disconnected!'),
        execute,
        subscribe,
        schema
      },
      {
        server: websocketServer,
        path: "/subscriptions"
      }
    );
  });
};
