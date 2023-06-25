const User = require('../model/User')
const Post = require('../model/Post')
const Comment = require('../model/Comment')
const Like = require('../model/Like')
const { generateToken, isPasswordMatch, registerUser, loginUser } = require('../controller/auth')
const getRequest = require('../controller/api')


const resolvers = {
    Query: {
        //Get all users
        //Private
       users: async (_, __, { user }) => {
        // console.log(user)
        // if (!user) {
        //     throw new Error('Not Authenticated')
        // }
        const users = User.find()
        return users
       },
       //Get Single user
       //Private
       user: async (_, { id }, { user }) => {
        if (!user) {
            throw new Error('Not Authenticated')
        }
        const userSelected = User.findById(id)
        return userSelected
       },
       // Get all Post
       // Private
       posts: async (_, __, {user}) => {
        if (!user) {
            throw new Error('Not Authenticated')
        }
        const Posts = await Post.find().populate('user')
        
        return Posts
       },

       //Get singe Post
       //Private
       post: async (_, {id}, {user}) => {
        if (!user) {
            throw new Error('Not Authenticated')
        }
    
        const post = await Post.findById(id).populate('user').populate('comments').populate('likes')
        return post

    },

    //Search for bible Api
    //private
    bible: async (_, {book, chapter_verse, options}, {user}) => {
        if (!user) {
            throw new Error('Not Authenticated')
        }
 
        const option = !options ? '' : `?options`

        const bibleResult = await  getRequest(`https://bible-api.com/${book}+${chapter_verse}${option}`)
        
        const verses = bibleResult.verses.map( x => ({
            book_id: x.book_id,
            book_name: x.book_name,
            chapter: x.chapter,
            verse: x.verse,
            text: x.text,
        }))

        const bible = {
            references: bibleResult.reference,
            text: bibleResult.text,
            translation_id: bibleResult.translation_id,
            translation_name: bibleResult.translation_name,
            translation_note: bibleResult.translation_note,
            verses: verses
        }
        
       console.log(bible)

        return bible
    }   
        
    },
    Mutation: {
        //Register User
        //Public
        register: async (_, {firstName, lastName, email, password}) => {
            return await registerUser(firstName, lastName, email, password)
        },

        // Login User
        // Public
        login: async (_, {email, password}) => {
         return await loginUser(email, password)
        },

        //Create single Post
        //Private
        createPost: async (_, {title, content}, {user}) => {
            if (!user) {
                throw new Error('Not Authenticated')
            }
                const newPost = await Post.create({
                title,
                content,
                user: user
            })
            return newPost.populate('user')
        },

        //Create as single Comment on a post
        //Private
        createComment: async (_, {postID, comment}, {user}) => {
            if (!user) {
                throw new Error('Not Authenticated')
            }

            const post = await Post.findById(postID)
            if (!post) {
                throw new Error('Post not found!')
            }

            const newComment = await Comment.create({
                comment,
                post: post._id,
                user: user
            })
          
            return (await newComment.populate('user')).populate('post')
        },

        //Create as single Like for a post
        //private
        createLike: async (_, {postID}, {user}) => {
            if (!user) {
                throw new Error('Not Authenticated')
            }

            const post = await Post.findById(postID)
            if (!post) {
                throw new Error('Post not found')
            }

            const newLike = await Like.create({
                post: post._id,
                user: user,
            });
            return (await newLike.populate('user')).populate('post')
        }
    }
}

module.exports = resolvers