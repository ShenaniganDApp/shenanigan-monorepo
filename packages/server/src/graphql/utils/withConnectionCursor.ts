import { connectionFromMongoCursor } from "@entria/graphql-mongoose-loader";
import { Model, Types } from "mongoose";

export type LoaderFn = <Context extends object>(
  ctx: Context,
  id: string | Types.ObjectId | object
) => any;

export const withConnectionCursor = <Context extends object>(
  model: Model<any>,
  loader: LoaderFn<Context>,
  condFn: (...p: any[]) => { conditions?: object; sort?: object }
) => (...params: any[]) => {
  const { conditions = {}, sort = {} } = condFn(...params);

  const [context, args] = params;

  const cursor = model.find(conditions).sort(sort);

  return connectionFromMongoCursor({
    cursor,
    context,
    args,
    loader
  });
};
