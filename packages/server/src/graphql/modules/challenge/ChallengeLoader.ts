import { createLoader } from '../../utils';

import { registerLoader } from '../../loaders/loaderRegister';

import ChallengeModel from './ChallengeModel';
import { challengeFilterMapping } from './ChallengeFilterInputType';

const { Wrapper: Challenge, getLoader, clearCache, load, loadAll } = createLoader({
  model: ChallengeModel,
  loaderName: 'ChallengeLoader',
  filterMapping: challengeFilterMapping,
});

export { getLoader, clearCache, load, loadAll };
export default Challenge;

registerLoader('ChallengeLoader', getLoader);