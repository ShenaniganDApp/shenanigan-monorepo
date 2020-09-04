import { IUser } from './modules/user/UserModel';
import { getDataloaders } from './loaders/loaderRegister';
import { GraphQLContext } from './TypeDefinition';

type ContextVars = {
  user?: IUser | null;
};
export const getContext = async (ctx: ContextVars = {}) => {
  const context: GraphQLContext = {
    ...ctx,
  };

  const dataloaders = getDataloaders();

  return {
    req: {},
    dataloaders,
    ...context,
  };
};