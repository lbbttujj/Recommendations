const DbResolver = require("./dataBaseController/dbResolvers");
const kinopoiskResolover = require("./kinopoiskController/kinopoiskResolvers");
const root = {
  ...DbResolver,
  ...kinopoiskResolover,
};

module.exports = root;
