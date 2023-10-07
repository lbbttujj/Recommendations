import { pool } from "../../../db";
import {
  DeleteDirectory,
  DeleteFilm,
  DeleteFilms,
  ClearDir,
  Directory,
  DirId,
  Film,
  Input,
  Recommend,
  User,
  UserId,
  VkId,
} from "./types";
export const dbResolvers = {
  getDirectories: async (params: UserId) => {
    const { userId } = params;
    const directories = await pool.query(
      "SELECT * FROM directories WHERE user_id = $1",
      [userId]
    );
    return directories.rows;
  },
  getFilms: async (params: DirId) => {
    const films = await pool.query("SELECT * FROM films WHERE dir_id = $1", [
      params.dirId,
    ]);
    return films.rows;
  },
  getUser: async (params: VkId) => {
    const { vkId } = params;
    const user = await pool.query(`SELECT * FROM users WHERE vk_id = ${vkId}`);
    return user.rows[0];
  },
  addUser: async ({ input }: Input<User>) => {
    const { vkId, userName } = input;
    console.log("here: ", vkId);
    const newUser = await pool.query(
      "INSERT INTO users (vk_id, user_name) VALUES ($1, $2) RETURNING *",
      [vkId, userName]
    );
    await pool.query(
      `INSERT INTO directories (id, user_id, dir_name, dir_type) VALUES (uuid_generate_v4(), ${vkId}, 'Избранное', 'Favorite')`
    );
    await pool.query(
      `INSERT INTO directories (id, user_id, dir_name, dir_type) VALUES (uuid_generate_v4(), ${vkId}, 'Рекомендованное', 'Recommended')`
    );
    return newUser.rows[0];
  },
  addDirectory: async ({ input }: Input<Directory>) => {
    let { userId, dirName, dirType } = input;
    dirType = dirType ? dirType : "";

    const newDirectory = await pool.query(
      "INSERT INTO directories (id, user_id, dir_name, dir_type) VALUES (uuid_generate_v4(), $1, $2, $3)  RETURNING *",
      [userId, dirName, dirType]
    );
    return newDirectory.rows[0];
  },
  addFilmToDirectory: async ({ input }: Input<Film>) => {
    const { dirId, kpId, imgUrl, name, description } = input;
    const newFilm = await pool.query(
      "INSERT INTO films (id, kp_id, dir_id, img_url, name, description) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING *",
      [kpId, dirId, imgUrl, name, description]
    );
    return newFilm.rows[0];
  },
  deleteFilm: async ({ input }: Input<DeleteFilm>) => {
    const { filmId } = input;
    return pool.query(`DELETE FROM films WHERE id = $1`, [filmId]);
  },
  deleteFilms: async ({ input }: Input<DeleteFilms>) => {
    const { filmIds } = input;
    return pool.query(
      `DELETE FROM films WHERE id in (${filmIds.map(
        (_, index) => `$${index + 1}`
      )})`,
      [...filmIds]
    );
  },
  clearDir: async ({ input }: Input<ClearDir>) => {
    const { dirId } = input;
    console.log(dirId);
    console.log(`DELETE FROM films WHERE dir_id  = ${dirId}`);
    return pool.query(`DELETE FROM films WHERE dir_id  = $1`, [dirId]);
  },
  deleteDirectory: async ({ input }: Input<DeleteDirectory>) => {
    const { dirId } = input;
    return pool.query(`DELETE FROM directories WHERE id = $1`, [dirId]);
  },
  recommend: async ({ input }: Input<Recommend>) => {
    const { usersIds, ...props } = input;
    try {
      usersIds.map(async (id) => {
        const dirRecommendId = await pool.query(
          `SELECT * FROM directories WHERE user_id = ${id} and dir_type = 'Recommended'`
        );
        if (dirRecommendId.rows.length > 0) {
          dbResolvers.addFilmToDirectory({
            input: {
              dirId: dirRecommendId.rows[0].id,
              ...props,
            },
          });
        }
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
