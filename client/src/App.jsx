import './App.css'
import { 
  ApolloClient, // will be used to create a new client instance
  InMemoryCache, // caching mechanism to to strore results of graphql queries
  ApolloProvider, // connects react and apollo server
  createHttpLink,// create a http link for graphql endpoint
  from,
 } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
// setContext is gonna be used to configure request headers
import { Outlet } from "react-router-dom";
// manipulates the ui dinamically 

// COMPONENTS
import Footer from "./components/Footer";
import Header from "./components/Header";

// creates main graphql endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});


// NOT NEEDED ANYMORE DELETE LATER
const errorLink = onError(({ graphQLErrors, networkError }) => { if (graphQLErrors) graphQLErrors.forEach(({ message, locations, path }) => console.log( `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`, ), ); if (networkError) console.log(`[Network error]: ${networkError}`); });



// set up context middleware to intercept every /graphql request to manipulate 
// apply JWT to the headers to see if user has authorization or not
const authLink = setContext((_, { headers }) => {
  // get token from local storage
  const token = localStorage.getItem('id_token');
  // return headers to the context sp httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
})
// creates new instance of ApolloClient 
// execute authLink middleware prior making the request to the graphql API
//  set up cache mechanism w in memory cache
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), 
  // link: authLink.concat(httpLink), put it back later
  cache: new InMemoryCache(),
});

function App() {

  return (
    // apolloprovider using client settings to insert react using apolloClient
    // now all react application have access to graphql endpoints and data
    <ApolloProvider client={client}> 
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    </ApolloProvider>
  )
};

export default App
