import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        id
        username
        email
        profile_img
        token
    }
  }
`

export const FOLLOW_MUTATION = gql`
  mutation FollowUser($userId: ID!) {
    follow(userId: $userId) {
      success
      followersCount
      following
    }
  }
`