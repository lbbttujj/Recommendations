const db = require("../../db");
const dbResolvers = {
  getDirectories: async (params) => {
    const directories = await db.query(
      "SELECT * FROM directories WHERE user_id = $1",
      [params.userId]
    );
    return directories.rows;
  },
  getFilms: async (params) => {
    const films = await db.query("SELECT * FROM films WHERE dir_id = $1", [
      params.dirId,
    ]);
    return films.rows;
  },
  addUser: async ({ input }) => {
    const { userName, userRole } = input;
    const newUser = await db.query(
      "INSERT INTO users (user_name) VALUES ($1) RETURNING *",
      [userName]
    );
    return newUser.rows[0];
  },
  addDirectory: async ({ input }) => {
    let { userId, dirName, dirType } = input;
    dirType = dirType ? dirType : "";

    const newDirectory = await db.query(
      "INSERT INTO directories (id, user_id, dir_name, dir_type) VALUES (uuid_generate_v4(), $1, $2, $3)  RETURNING *",
      [userId, dirName, dirType]
    );
    return newDirectory.rows[0];
  },
  addFilmToDirectory: async ({ input }) => {
    const { dirId, kpId, imgUrl, name, description } = input;
    const newFilm = await db.query(
      "INSERT INTO films (id, kp_id, dir_id, img_url, name, description) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING *",
      [kpId, dirId, imgUrl, name, description]
    );
    return newFilm.rows[0];
  },
  deleteFilm: async ({ input }) => {
    console.log(input);
    const { filmId } = input;
    res = db.query(`DELETE FROM films WHERE id = $1`, [filmId]);
    return res;
  },
  deleteDirectory: async ({ input }) => {
    const { dirId } = input;
    res = db.query(`DELETE FROM directories WHERE id = $1`, [dirId]);
    return res;
  },
};

module.exports = dbResolvers;
