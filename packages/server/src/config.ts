interface IConfig {
  graphqlURL: string;
  ipfsEndpoint: string;
  imgixToken: string;
}

function parseEnv<T extends string | number>(
  v: string | undefined,
  defaultValue: T,
): T {
  if (!v) return defaultValue;

  if (typeof defaultValue === 'number') {
    return Number(v) as T;
  }
  return v as T;
}

export const CONFIG: IConfig = {
  graphqlURL: parseEnv(
    process.env.GRAPHQL_URL,
    'http://localhost:8080/graphql',
  ),
  ipfsEndpoint: parseEnv(process.env.IPFS_ENDPOINT, 'https://ipfs.infura.io'),
  imgixToken: parseEnv(process.env.IMGIX_TOKEN, ''),
};