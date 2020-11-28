import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import { challengeFilterMapping } from "./ChallengeFilterInputType";
import { ChallengeModel } from "./ChallengeModel";

const {
  Wrapper: Challenge,
  getLoader,
  clearCache,
  load,
  loadAll
} = createLoader({
  model: ChallengeModel,
  loaderName: "ChallengeLoader",
  filterMapping: challengeFilterMapping
});

export { getLoader, clearCache, load, loadAll };
export { Challenge };

registerLoader("ChallengeLoader", getLoader);
