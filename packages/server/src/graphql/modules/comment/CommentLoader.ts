import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import { commentFilterMapping } from "./CommentFilterInputType";
import { CommentModel } from "./CommentModel";

const { Wrapper: Comment, getLoader, clearCache, load, loadAll } = createLoader(
  {
    model: CommentModel,
    loaderName: "CommentLoader",
    filterMapping: commentFilterMapping
  }
);

export { getLoader, clearCache, load, loadAll };
export { Comment };

registerLoader("CommentLoader", getLoader);
