// import dependencies and files
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-errors');

const { typeDefs, resolvers } = require('./schemas');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers
    // context: ({ req }) => {
    //     const token = req.headers.authorization || '';
    //     let user = null;
    //     if (token) {
    //         try {
    //             user = jwt.verify(token.split(' ')[1], secret).data;
    //         } catch (e) {
    //             throw new AuthenticationError('Invalid or expired token');
    //         }
    //     }

    //     return { user };
    // }
});


// create instance of apollo server with graphql schema
const startApolloServer = async () => {
    await server.start();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use('/graphql', expressMiddleware(server));

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
        })
    })
};

// call function to start the server
startApolloServer();