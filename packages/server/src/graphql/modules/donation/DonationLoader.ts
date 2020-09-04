import { createLoader } from '../../utils';

import { registerLoader } from '../../loaders/loaderRegister';

import DonationModel from './DonationModel';
import { donationFilterMapping } from './DonationFilterInputType';

const { Wrapper: Donation, getLoader, clearCache, load, loadAll } = createLoader({
  model: DonationModel,
  loaderName: 'DonationLoader',
  filterMapping: donationFilterMapping,
});

export { getLoader, clearCache, load, loadAll };
export default Donation;

registerLoader('DonationLoader', getLoader);