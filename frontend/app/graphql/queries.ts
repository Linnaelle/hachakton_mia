import { gql } from "@apollo/client"


export const GET_ALL_TWEETS = gql`
  query GET_ALL_TWEETS {
    publicTimeline {
      id
      content
      media
      likes
      retweets
      isRetweet
      isRetweeted
      isLiked
      isFollowing
      createdAt
      comments
      author {
        profile_img
        _id
        username
      }
    }
  }
`

export const GET_TWEETS = gql`
  query GetTweets {
    getTimeline {
      id
      content
      media
      likes
      retweets
      isRetweet
      isRetweeted
      isLiked
      isFollowing
      createdAt
      comments
      author {
        profile_img
        _id
        username
      }
    }
  }
`
// Définition de la requête GraphQL
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
        _id
        username
        handle
        profile_img
      }
      comments {
        id
        content
        createdAt
        author {
          _id
          username
          handle
          profile_img
        }
      }
    }
  }
`;