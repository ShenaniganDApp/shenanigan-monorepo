import { UserModel } from '../models';
import jwt from 'jsonwebtoken';

export default async (ctx, next) => {
  const authHeader = ctx.get('Authorization');
  if (!authHeader) {
    ctx.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; //Bearer "token"

  if (!token || token === '') {
    ctx.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    ctx.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    ctx.isAuth = false;
    return next();
  }
  ctx.isAuth = true;

  ctx.user = await UserModel.findOne({
    _id: (decodedToken as { userId: string }).userId
  });
  next();
};
