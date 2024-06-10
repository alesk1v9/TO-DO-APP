// require class from graphql to create personalize errors 
const { GraphQLError } = require('graphql');
// require jwt to create tokens JWT (authenticantion, autorization)
const jwt = require('jsonwebtoken');

// secret for jwt token
const secret = 'secretsecretsecret';
// expiration for jwt token
const expiration = '2h';

module.exports = {
    AuthenticationError: new GraphQLError('Could not authenticate user.', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      }),
      authMiddleware: function ({ req }) {
          let token = req.body.token || req.query.token || req.headers.authorization;
          
    
        if (req.headers.authorization) {
          token = token.split(' ').pop().trim();
        }
    
        if (!token) {
          return req;
        }
    
        try {
          const { data } = jwt.verify(token, secret, { maxAge: expiration });
          req.user = data;
        } catch {
          console.log('Invalid token');
        }
    
        return req;
      },
    // function to generate token using the user data and returns a token and user
    signToken: function({ email, username, _id }) {
        const payload = { email, username, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};