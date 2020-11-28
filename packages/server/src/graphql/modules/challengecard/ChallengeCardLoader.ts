import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import { challengeCardFilterMapping } from "./ChallengeCardFilterInputType";
import ChallengeCardModel from "./ChallengeCardModel";

const {
  Wrapper: ChallengeCard,
  getLoader,
  clearCache,
  load,
  loadAll
} = createLoader({
  model: ChallengeCardModel,
  loaderName: "ChallengeCardLoader",
  filterMapping: challengeCardFilterMapping
});

export { getLoader, clearCache, load, loadAll };
export default ChallengeCard;

registerLoader("ChallengeCardLoader", getLoader);
