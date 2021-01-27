import { Request } from 'koa';

import { getDataloaders } from './loaders/loaderRegister';
import { IUser } from './modules/user/UserModel';
import { GraphQLContext } from './TypeDefinition';

type ContextVars = {
	user?: IUser | null;
	req?: Request;
};
export const getContext = async (ctx: ContextVars) => {
	const dataloaders = getDataloaders();

	return {
		req: ctx.req,
		dataloaders,
		user: ctx.user,
	} as GraphQLContext;
};
