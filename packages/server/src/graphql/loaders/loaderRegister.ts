import { DataLoaderKey } from '../utils/createLoader';
import DataLoader from 'dataloader';

export interface DataLoaders {
	ChallengeLoader: ReturnType<typeof import('../modules/challenge/ChallengeLoader').getLoader>;
	ChallengeCardLoader: ReturnType<typeof import('../modules/challengecard/ChallengeCardLoader').getLoader>;
	CommentLoader: ReturnType<typeof import('../modules/comment/CommentLoader').getLoader>;
	DonationLoader: ReturnType<typeof import('../modules/donation/DonationLoader').getLoader>;
	PredictionLoader: ReturnType<typeof import('../modules/prediction/PredictionLoader').getLoader>;
	UserLoader: ReturnType<typeof import('../modules/user/UserLoader').getLoader>;
	VoteLoader: ReturnType<typeof import('../modules/vote/VoteLoader').getLoader>;
}

const loaders: { [Name in keyof DataLoaders]: () => DataLoaders[Name] } = {} as any;

const registerLoader = <Name extends keyof DataLoaders>(key: Name, getLoader: () => DataLoaders[Name]) => {
	loaders[key] = getLoader as any;
};

const getDataloaders = (): DataLoaders =>
	(Object.keys(loaders) as (keyof DataLoaders)[]).reduce(
		(prev, loaderKey) => ({
			...prev,
			[loaderKey]: loaders[loaderKey](),
		}),
		{}
	) as any;

export { registerLoader, getDataloaders };
