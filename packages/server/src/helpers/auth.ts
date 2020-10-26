import jwt from "jsonwebtoken";

import { UserModel } from "../models";

export async function getUser(token: string) {
  if (!token) return { user: null };

  try {
    const decodedToken = jwt.verify(token, "somesupersecretkey");

    const user = await UserModel.findOne({
      _id: (decodedToken as { userId: string }).userId,
    });

    return user;
  } catch (err) {
    return { user: null };
  }
}

type UserType = {
  _id: string;
};
