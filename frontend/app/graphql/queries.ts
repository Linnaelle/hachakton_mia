/**
 * Définition des requêtes GraphQL
 * Regroupe toutes les opérations GraphQL qui récupèrent des données
 */
import { gql } from "@apollo/client";

/**
 * Requête pour récupérer un tweet spécifique par son ID
 * Inclut les détails du tweet, de l'auteur et des commentaires
 * 
 * @param {ID!} id - ID du tweet à récupérer
 * @returns Les informations complètes du tweet avec ses commentaires
 */
export const GET_TWEET = gql`
  query GetTweet($id: ID!) {
    getTweet(id: $id) {
      id
      content
      createdAt
      media
      isLiked
      isRetweeted
      author {
        id
        username
        handle
        profile_img
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
          handle
          profile_img
        }
      }
    }
  }
`;