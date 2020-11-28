import fs from "fs";
import { printSchema } from "graphql/utilities";
import path from "path";
import { promisify } from "util";

import { schema as schemaGraphql } from "../src/graphql/schema";

const writeFileAsync = promisify(fs.writeFile);

(async () => {
  const configs = [
    {
      schema: schemaGraphql,
      path: "../src/graphql/schema"
    }
  ];

  await Promise.all([
    ...configs.map(async config => {
      await writeFileAsync(
        path.join(__dirname, `${config.path}/schema.graphql`),
        printSchema(config.schema)
      );
    })
  ]);

  process.exit(0);
})();
