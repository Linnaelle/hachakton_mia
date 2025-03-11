const { gql } = require('apollo-server')

const typeDefs = gql`
  type Tweet {
    id: ID!
    content: String!
    author: User!
    createdAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String
    tweets: [Tweet]
  }

  type Query {
    getTweet(id: ID!): Tweet
    searchTweets(query: String!): [Tweet]
    getCurrentUser: User
  }

  type Mutation {
    createTweet(content: String!): Tweet
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    logout: LogoutResponse!
  }
  
  type LogoutResponse {
    success: Boolean!
    message: String!
  }
`;

module.exports = typeDefs