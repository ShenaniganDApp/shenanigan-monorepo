const config = {
    // ...
    // Configuration options accepted by the `relay-compiler` command-line tool and `babel-plugin-relay`.
    src: './src',
    schema: '../server/src/graphql/schema/schema.graphql',
    exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**']
};

export { config };
