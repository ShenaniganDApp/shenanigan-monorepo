const { buildSchema } = require('graphql');

///////////////////////////////////////////////////////////////////////////
///   Schema Notes:                                                     ///
///     - Input types and query types are seperate                      ///
///     - ! is required, notice password is not required                ///
///        for the query because password should never be returned      ///
///     - Layout                                                        ///
///         User -> one to many -> Polls                               ///
///         Polls -> one to many -> Prediction                            ///
///         User -> one to many -> Prediction                              ///
///////////////////////////////////////////////////////////////////////////
module.exports = buildSchema(`
        interface Node {
            id: ID!
        }

        type PageInfoExtended {
            hasNextPage: Boolean!
            hasPreviousPage: Boolean!
            startCursor: String
            endCursor: String
        }

        input PollInput {
            title: String! 
            description: String!
        }

        input CreateUserInput {
            username: String!
            email: String!
            password: String!
            clientMutationId: String!
        }

        input LoginUserInput{
            email: String!
            password: String!
            clientMutationId: String
        }

        input CommentInput {
            content: String!
            createdAt: String!
            updatedAt: String!
        }

        type Option {
            _id: ID!
            description: String!
            poll: Poll!
            bets: [Prediction!]
        }

        type Comment {
            _id: ID!
            poll: Poll!
            content: String!
            createdAt: String!
            updatedAt: String!
            user: User!
        }

        type Prediction {
            _id: ID!
            poll: Poll!
            amount: Float!
            user: User!
            createdAt: String!
            updatedAt: String!
        }
        type Poll implements Node {
            id: ID!
            _id: ID!
            title: String!
            description: String
            createdAt: String!
            updatedAt: String!
            creator: User!
            options: [Option!]!
            comments: [Comment!]
            live: Boolean!
        }

        type PollAddedPayload {
            pollEdge: PollEdge
          }

        type PollConnection {
            count: Int!
            totalCount: Int!
            startCursorOffset: Int!
            endCursorOffset: Int!
            pageInfo: PageInfoExtended!
            edges: [PollEdge]!
        }

        type PollEdge {
            node: User!
            cursor: String!
        }
        

        type Subscription {
            UserAdded: UserAddedPayload
          }

        type User implements Node {
            id: ID!
            _id: ID!
            username: String!
            email: String!
            password: String!
            createdPolls: PollConnection
            createdBets: [Prediction!]
        }

        type UserAddedPayload {
            userEdge: UserEdge
          }

        type UserConnection {
            count: Int!
            totalCount: Int!
            startCursorOffset: Int!
            endCursorOffset: Int!
            pageInfo: PageInfoExtended!
            edges: [UserEdge]!
        }
        
        type UserEdge {
            node: User!
            cursor: String!
        }

        type AuthPayload {
            token: String
            error: String
            clientMutationId: String
        }
        type LoginPayload{ 
            token: String
            error: String
            clientMutationId: String
        }

        type PollPayload {
            poll: Poll
            clientMutationId: String!
        }

        type rootQuery {
            polls(userId:ID!): [Poll!]!
            bets(optionId:ID!): [Prediction!]!
            comments(pollId:ID!): [Comment!]!
            login(email: String!, password: String!): User
            verify(address: String!, signature: String!): User
            node(id: ID!): Node
            me: User
            user(id: ID!): User
            users(after: String, first: Int, before: String, last: Int, search: String): UserConnection
        }

        type rootMutation {
            createPoll(pollInput: PollInput!): PollPayload
            createUser(createUserInput: CreateUserInput!): AuthPayload
            loginUser(loginUserInput: LoginUserInput!): LoginPayload
            addOption(description: String): Option
            startPoll(options: [ID!]!, live: Boolean!): Poll!
            pollComment(commentInput: CommentInput): Comment!
            betPoll(pollId: ID!, amount: Float!): Prediction!
            cancelBet(betId: ID!): Poll!
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `);

//User
// addresses: [String!]!
// nonce: String!
// createdPolls: [Poll!]
