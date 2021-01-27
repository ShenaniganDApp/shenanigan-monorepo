import { debug } from 'console';
import { execute, subscribe } from 'graphql';
import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { app } from './app';
import { getContext } from './graphql/getContext';
import { schema } from './graphql/schema/index';
import { authHandler } from './middleware/auth';

type ConnectionParams = {
	authorization?: string;
};

(async () => {
	const server = http.createServer(app.callback());

	server.listen(process.env.PORT, () => {
		console.log(`server running on port :${process.env.PORT}`);
	});

	SubscriptionServer.create(
		{
			onConnect: async (connectionParams: ConnectionParams) => {
				const user = await authHandler(connectionParams.authorization);
        console.log('Client subscription connected!')
				return await getContext({ user });
        
			},
			// eslint-disable-next-line
			onDisconnect: () => console.log('Client subscription disconnected!'),
			execute,
			subscribe,
			schema,
		},
		{
			server,
			path: '/subscriptions',
		}
	);
	console.log(`Websocket Server is now running on http://localhost:${process.env.PORT}`);
})();
