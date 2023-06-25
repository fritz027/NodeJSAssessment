const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./schema/typedefs')
const resolvers = require('./schema/resolvers')
const cookieParser = require('cookie-parser')
const { getUserFromToken } = require('./controller/auth')


//load ENV vars
dotenv.config({ path: './config/config.env'})


//Connect to DB
connectDB()


const app = express()

// Body Parse
app.use(express.json())
app.use(cookieParser())
//Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(errorHandler)
const PORT = process.env.PORT || 8000

let apolloServer = null;

async function startServer() {
    try
    {
        apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
        context: ({ req }) => {
                const token = req.headers.authorization || '';
                let user = null;
                if (token) {
                    try {
                        user = getUserFromToken(token)
                    } catch (error) {
                        console.log(error)
                        throw new Error('Invalid token');
                    }
                }
                return { user };
            },
            
        })
        
        await apolloServer.start()
        apolloServer.applyMiddleware({ app })
    } catch (error) {
        console.log(error)
    }
}

startServer()

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode`))
console.log(`gql path is ${apolloServer.graphqlPath}`);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    server.close( () => process.exit(1))
})