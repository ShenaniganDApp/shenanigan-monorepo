import { createLoader } from '../../utils';

import { registerLoader } from '../../loaders/loaderRegister';

import PredictionModel from './PredictionModel';
import { predictionFilterMapping } from './PredictionFilterInputType';

const { Wrapper: Prediction, getLoader, clearCache, load, loadAll } = createLoader({
  model: PredictionModel,
  loaderName: 'PredictionLoader',
  filterMapping: predictionFilterMapping,
});

export { getLoader, clearCache, load, loadAll };
export default Prediction;

registerLoader('PredictionLoader', getLoader);