import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import { voteFilterMapping } from "./VoteFilterInputType";
import { VoteModel } from "./VoteModel";

const { Wrapper: Vote, getLoader, clearCache, load, loadAll } = createLoader({
  model: VoteModel,
  loaderName: "VoteLoader",
  filterMapping: voteFilterMapping,
});

export { getLoader, clearCache, load, loadAll };
export { Vote };

registerLoader("VoteLoader", getLoader);
