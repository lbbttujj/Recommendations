import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";

// @ts-ignore
export const schema = loadSchemaSync("./**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});
