export type UserId = {
  userId: number;
};

export type DirId = {
  dirId: string;
};

export type VkId = {
  vkId: number;
};

export type Directory = {
  userId: number;
  dirName: string;
  dirType: string;
};

export type Film = {
  kpId: number;
  dirId: string;
  imgUrl: string;
  name: string;
  description: string;
};

export type User = {
  vkId: number;
  userName: string;
  userRole: string;
};

export type DeleteFilm = {
  filmId: string;
};

export type DeleteFilms = {
  filmIds: string[];
};

export type ClearDir = {
  dirId: string;
};

export type DeleteDirectory = {
  dirId: string;
};

type UserInfo = {
  userId: number;
  userName: string;
};

export type Recommend = {
  usersInfo: UserInfo[];
  userName: string;
  kpId: number;
  imgUrl: string;
  name: string;
  description: string;
};

export type Input<T> = {
  input: T;
};
