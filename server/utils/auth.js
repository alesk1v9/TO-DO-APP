// require class from graphql to create personalize errors 
const { GraphQLError } = require('graphql');
// require jwt to create tokens JWT (authenticantion, autorization)
const jwt = require('jsonwebtoken');

// secret for jwt token
const secret = 'secretsecretsecret';
// expiration for jwt token
const expiration = '2h';

module.exports = {
    // create custom error for authentication
    AuthenticationError: new GraphQLError('Could not authenticate user!', {
        extentions: {
            code: 'UNAUTHENTICATED',
        },
    }),
    // function to generate token using the user data and returns a token and user
    signToken: function({ email, username, _id }) {
        const payload = { email, username, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};