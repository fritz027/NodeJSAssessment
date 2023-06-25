const { gql } =  require('apollo-server')


const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    } 

    type Post {
        id: ID!
        title: String!
        content: String!
        user: User!
        comments: [Comment!]!
        likes: [Like!]!
       
    }

    type Comment {
        id:  ID!
        comment: String!
        post: Post!
        user: User!
    }

    type Like {
        id: ID!,
        post: Post!
        user: User!
    }

    type Verses {
        book_id: String!
        book_name: String!
        chapter: String!
        verse: Int!
        text: String!
    }

    type Bible {
        references: String!
        text: String!
        translation_id: String!
        translation_name: String!
        translation_note: String!
        verses: [Verses!]!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User!
        posts: [Post!]!
        post(id: ID!): Post
        bible(book: String!, chapter_verse: String!, options: String!): Bible
    }

    type Mutation  {
        register(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        createPost(title: String!,  content: String!): Post
        createComment(postID: ID!, comment: String!): Comment
        createLike(postID: ID!): Like
        
    }
`

module.exports = typeDefs