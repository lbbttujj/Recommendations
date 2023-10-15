import { Input, Recommend } from "../types";
import { pool } from "../../../../db";
import { dbResolvers } from "../dbResolvers";

const getRecommendDirId = ({ userId }: { userId: number }) =>
  pool.query(
    `SELECT * FROM directories WHERE user_id = ${userId} and dir_type = 'Recommended'`
  );

const checkFilmExist = ({ dirId, kpId }: { dirId: string; kpId: number }) => {
  return pool.query("SELECT id FROM films WHERE dir_id = $1 and kp_id = $2", [
    dirId,
    kpId,
  ]);
};

const addFilmToRecommend = ({
  dirId,
  kpId,
  props,
}: {
  dirId: string;
  kpId: number;
  props: {
    userName: string;
    imgUrl: string;
    name: string;
    description: string;
  };
}) => {
  return dbResolvers.addFilmToDirectory({
    input: {
      dirId: dirId,
      kpId,
      ...props,
    },
  });
};

export const recommendQuery = async ({ input }: Input<Recommend>) => {
  const { usersInfo, kpId, ...props } = input;
  const queryResponse = { isError: false, message: "" };
  await Promise.all(
    usersInfo.map(async ({ userId, userName }) => {
      const dirRecommendId = await getRecommendDirId({ userId });
      if (dirRecommendId.rows.length > 0) {
        const dirId = dirRecommendId.rows[0].id;
        const films = await checkFilmExist({ dirId, kpId });
        if (films.rows.length) {
          queryResponse.isError = true;
          queryResponse.message = `Фильм уже рекомендован ${userName}`;
        } else {
          addFilmToRecommend({ kpId, dirId, props });
        }
      } else {
        const user = await dbResolvers.getUser({ vkId: userId });
        if (!user) {
          dbResolvers
            .addUser({
              input: { vkId: userId, userName: userName, userRole: "user" },
            })
            .then((res) => {
              const newInput = { ...input };
              newInput.usersInfo = [
                { userId: res.vk_id, userName: res.user_name },
              ];

              recommendQuery({ input: newInput });
            });
        } else {
          dbResolvers
            .addDirectory({
              input: {
                userId: userId,
                dirName: "Рекомендованное",
                dirType: "Recommended",
              },
            })
            .then(() => {
              const newInput = { ...input };
              newInput.usersInfo = [
                { userId: user.vk_id, userName: user.user_name },
              ];

              recommendQuery({ input: newInput });
            });
        }
      }
    })
  );

  return queryResponse;
};
