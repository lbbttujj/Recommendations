import { dbResolvers } from "./resolvers/dataBaseResolver/dbResolvers";
import { kinopoiskResolvers } from "./resolvers/kinopoiskResolver/kinopoiskResolvers";
export const root = {
  ...dbResolvers,
  ...kinopoiskResolvers,
};
