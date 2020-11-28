import { registerLoader } from "../../loaders/loaderRegister";
import { createLoader } from "../../utils";
import { donationFilterMapping } from "./DonationFilterInputType";
import { DonationModel } from "./DonationModel";

const {
  Wrapper: Donation,
  getLoader,
  clearCache,
  load,
  loadAll
} = createLoader({
  model: DonationModel,
  loaderName: "DonationLoader",
  filterMapping: donationFilterMapping
});

export { getLoader, clearCache, load, loadAll };
export { Donation };

registerLoader("DonationLoader", getLoader);
