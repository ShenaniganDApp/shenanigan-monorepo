import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import UserModel from "./UserModel";

const { Wrapper: User, getLoader, clearCache, load, loadAll } = createLoader({
  model: UserModel,
  loaderName: "UserLoader"
});

export { getLoader, clearCache, load, loadAll };
export default User;

registerLoader("UserLoader", getLoader);
