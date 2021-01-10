import { did } from '@shenanigan/utils';
import { Request, Response } from 'koa';

import { IUser, UserModel } from '../models';

function getHeaderToken(authHeader: string | null | undefined): string | null {
	if (!authHeader) return null;
	const token = authHeader.replace('Bearer ', '');
	if (token.length === 0) return null;
	return token;
}

export const authHandler = async (authHeader:string | null | undefined): Promise<IUser | null> => {
	const token = getHeaderToken(authHeader);

  if (!token) {
    return null;
  }
  const claim = did.verifyToken(token);

  const user = await UserModel.findOne({
    addresses: claim.iss
  });

	return user;
};
