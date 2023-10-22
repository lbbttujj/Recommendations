import { gql } from '@apollo/client'

export const SEARCH_FILMS = gql(`
query getKpFilms($value: String){
  getKpFilms(searchValue:$value) {
    id,
    name
    shortDescription
    poster {
      previewUrl
    }
  }
}
`)

export const GET_FILM_DETAILS = gql(`
query getFilmDetails($kpId: Int){
  getFilmDetails(kpId: $kpId) {
    description,
     videos {
        trailers {
            url
        }
    }
   watchability {
    items {
      url
      logo {
        url
      }
    }
  }
  }
 }
`)
