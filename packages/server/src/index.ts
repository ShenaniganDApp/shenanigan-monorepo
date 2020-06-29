import app from './app';
import debug = require('debug');
('http');
import http from 'http';

import subscriptionServer from './subscriptionServer';
import { schema } from './graphql/schema/index';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

(async () => {
  const normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  };

  const onError = (error) => {
    const addr = server.address();
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
    debug('Listening on ' + bind);
  };

  const port = '8080';
  const WS_PORT = '8080';

  const server = http.createServer(app.callback());

  server.on('error', onError);
  server.on('listening', onListening);
  server.listen(port);

  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    }
  );
  console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`);
})();
