const { buildSchema } = require("graphql");
const schema = buildSchema(`
type User {
    vk_id: Int
    user_name: String
    user_role: String
}
type Directory {
    id: ID
    user_id: Int
    dir_name: String
    dir_type: String
}

type Film {
    id: ID
    kp_id: Int
    dir_id: ID
    img_url: String
    name: String
    shortDescription: String,
}

input AddFilmToGroup {
    dirId: ID
    kpId: Int
    imgUrl: String
    name: String
    description: String
}

input AddDirectory {
    userId: Int!
    dirName: String!
    dirType: String
}

input DeleteFilm {
    filmId: String!
}

input DeleteDirectory {
    dirId: String!
}

input AddUser {
    userName: String!
    userRole: String
}

type Url {
    url: String
}

type KpFilm {
    id: Int
    name: String
    poster: Url
    shortDescription: String
}

type Watchability {
    name: String
    logoUrl: String
    url: String
}

type Query {
    getDirectories(userId: Int): [Directory]
    getFilms(dirId: ID): [Film]
    getKpFilms(searchValue: String): [KpFilm]
    getWatchability(kpId: Int): [Watchability]
}

type Mutation {
    addDirectory(input: AddDirectory): Directory
    addFilmToDirectory(input: AddFilmToGroup) : Film
    deleteFilm(input: DeleteFilm): Film
    deleteDirectory(input: DeleteDirectory): Directory
    addUser(input: AddUser):User
}
`);

module.exports = schema;
