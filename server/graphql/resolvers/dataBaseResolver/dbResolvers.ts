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
import { recommendQuery } from "./queries/recommend";
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
    const isFilmAlreadyExist = await pool.query(
      "SELECT id FROM films WHERE dir_id = $1 and kp_id = $2",
      [dirId, kpId]
    );
    if (isFilmAlreadyExist.rows.length) {
      return new Error("Фильм уже добавлен в эту папку");
    } else {
      const newFilm = await pool.query(
        "INSERT INTO films (id, kp_id, dir_id, img_url, name, description) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING *",
        [kpId, dirId, imgUrl, name, description]
      );
      return newFilm.rows[0];
    }
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
    return pool.query(`DELETE FROM films WHERE dir_id  = $1`, [dirId]);
  },
  deleteDirectory: async ({ input }: Input<DeleteDirectory>) => {
    const { dirId } = input;
    return pool.query(`DELETE FROM directories WHERE id = $1`, [dirId]);
  },
  recommend: async ({ input }: Input<Recommend>) => {
    const res = await recommendQuery({ input });
    if (res.isError) {
      return new Error(res.message);
    } else {
      return true;
    }
  },
};
