const { gql } = require('apollo-server')

const typeDefs = gql`
  scalar Upload

  type Tweet {
    id: ID!
    content: String!
    media: String
    author: User!
    mentions: [User]
    likes: [User]
    comments: [Comment]
    retweets: [Tweet]
    hashtags: [String]
    createdAt: String!
  }
  
  type Comment {
    id: ID!
    content: String!
    author: User!
    tweet: Tweet!
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
    getTimeline: [Tweet!]!
    getUserTweets(userId: ID!): [Tweet!]!
  }

  type Mutation {
    createTweet(
      content: String!
      media: Upload
      mentions: [ID]
      hashtags: [String]
    ): Tweet!
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