const axios = require("axios");
const searchMock = require("./mocks");
const config = {
  headers: {
    "X-API-KEY": process.env.KINO_POISK_KEY,
    accept: "application/json",
  },
};
const kinopoiskResolvers = {
  getKpFilms: async (params) => {
    //   const kpFilms = await axios.get(
    //     `https://api.kinopoisk.dev/v1/movie?selectFields=name&selectFields=poster.url&selectFields=shortDescription&selectFields=id&page=1&limit=10&name=${params.searchValue}`,
    //     config
    //   );
    //   return kpFilms.data.docs;
    return searchMock;
  },
};

module.exports = kinopoiskResolvers;
