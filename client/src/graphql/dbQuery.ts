import { gql } from '@apollo/client'

export const GET_DIRECTORIES = gql(`
query getDirectories($userId: Int){
    getDirectories(userId:$userId) {
        id,dir_name,dir_type
    }
}
`)
export const GET_FiLMS = gql(`
query getFilms($dirId: ID){
  getFilms(dirId: $dirId) {
    kp_id
    id,
    name,
    img_url
   }
 }
`)

export const GET_USER = gql(`
 query getUser($vkId: Int){
    getUser(vkId: $vkId) {
    vk_id,
    user_name,
    user_role
    }
 }
`)

export const ADD_DIR = gql(`
mutation addDirectory ($input: AddDirectory){
  addDirectory(input: $input) {
    dir_name
  }
 }
`)

export const ADD_USER = gql(`
mutation addUser($input: AddUser) {
  addUser(input: $input) {
    vk_id,
    user_name
  }
 }
`)

export const ADD_FILM_TO_DIR = gql(`
mutation addFilmToDirectory ($input: AddFilmToGroup) {
        addFilmToDirectory(input: $input) {
        id  
     }
}
`)

export const DELETE_FILM = gql(`
mutation deleteFilm ($filmId: String!){
   deleteFilm(input: {filmId: $filmId}){
   id
   }
}
`)

export const DELETE_FILMS = gql(`
mutation deleteFilms($input: DeleteFilms){
   deleteFilms(input: $input){
        id
   }
}
`)

export const CLEAR_DIR = gql(`
mutation clearDir($input: ClearDir){
   clearDir(input: $input){
        id
   }
}
`)

export const DELETE_DIR = gql(`
mutation deleteDirectory($input: DeleteDirectory){
    deleteDirectory(input: $input){
        id
    }
}
`)

export const RECOMMEND = gql(`
mutation recommend($input: Recommend){
    recommend(input: $input)
}
`)
