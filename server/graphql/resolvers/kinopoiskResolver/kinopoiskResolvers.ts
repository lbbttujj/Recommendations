import axios from "axios";
import * as mocks from "./mocks";
import { FilmId, SearchValue } from "./types";
const config = {
  headers: {
    "X-API-KEY": process.env.KINO_POISK_KEY,
    accept: "application/json",
  },
};
export const kinopoiskResolvers = {
  getKpFilms: async (params: SearchValue) => {
    //   const kpFilms = await axios.get(
    //     `https://api.kinopoisk.dev/v1/movie?selectFields=name&selectFields=poster.previewUrl&selectFields=shortDescription&selectFields=id&page=1&limit=10&name=${params.searchValue}`,
    //     config
    //   );
    //   return kpFilms.data.docs;
    return mocks.searchMock;
  },
  getFilmDetails: async (params: FilmId) => {
    // const filmDetails = await axios.get(
    //   `https://api.kinopoisk.dev/v1/movie/${params.kpId}`,
    //   config
    // );
    // return filmDetails.data;
    return mocks.filmDetailsMock;
  },
};
