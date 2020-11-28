import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import { predictionFilterMapping } from "./PredictionFilterInputType";
import PredictionModel from "./PredictionModel";

const {
  Wrapper: Prediction,
  getLoader,
  clearCache,
  load,
  loadAll
} = createLoader({
  model: PredictionModel,
  loaderName: "PredictionLoader",
  filterMapping: predictionFilterMapping
});

export { getLoader, clearCache, load, loadAll };
export default Prediction;

registerLoader("PredictionLoader", getLoader);
