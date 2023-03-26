import { gql } from '@apollo/client'

export const SEARCH_FILMS = gql(`
query getKpFilms($value: String){
  getKpFilms(searchValue:$value) {
    id,
    name
    shortDescription
    poster {
      url
    }
  }
}
`)
