import { did } from "@shenanigan/utils";
import { Request, Response } from "koa";

import { IUser, UserModel } from "../models";

function getHeaderToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  if (token.length === 0) return null;
  return token;
}

export const authHandler = async (
  req: Request,
  res: Response
): Promise<IUser | null> => {
  const token = getHeaderToken(req);

  if (!token) {
    return null;
  }
  const claim = did.verifyToken(token);
  if (!claim) {
    res.status = 401;
    return null;
  }
  const user = await UserModel.findOne({
    addresses: claim.iss,
  });

  return user;
};
