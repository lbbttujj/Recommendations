import { gql } from '@apollo/client'

export const GET_DIRECTORIES = gql(`
query getDirectories($userId: Int){
    getDirectories(userId:$userId) {
        id,dir_name
    }
}
`)
export const GET_FiLMS = gql(`
query getFilms($dirId: ID){
  getFilms(dirId: $dirId) {
    id,
    name,
    img_url
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

export const DELETE_DIR = gql(`
mutation deleteDirectory($input: DeleteDirectory){
    deleteDirectory(input: $input){
        id
    }
}
`)
