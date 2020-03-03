const app = require('./app');
const debug = require('debug')('http');
const http = require('http');

// const subscriptionServer = require('./subscriptionServer');

const normalizePort = val => {
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

const onError = error => {
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

const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);

// subscriptionServer(app);

// /** GraphQL Websocket definition **/
// SubscriptionServer.create(
//   {
//     graphqlSchema,
//     execute,
//     subscribe,
//     onConnect: () => {
//       // My device does connects
//       console.log('client connected');
//     }
//   },

//   {
//     server: app,
//     path: '/subscriptions'
//   }
// );
