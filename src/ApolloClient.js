




// import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';

// // Create HTTP link
// const httpLink = createHttpLink({
//   uri: 'http://localhost:8000/graphql/', // Ensure no trailing slash if not needed
//   credentials: 'include', // Important for cookies if using them
// });

// // Auth middleware to add token to headers
// const authLink = setContext((_, { headers }) => {
//   // Get the token from localStorage
//   const token = localStorage.getItem('token');
//   console.log("Using token:", token);
  
//   // Return the headers to the context
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `JWT ${token}` : "",
//     }
//   };
// });

// // Create Apollo Client instance
// const client = new ApolloClient({
//   link: authLink.concat(httpLink), // Chain the auth and http links
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: 'cache-and-network',
//     },
//   },
// });

// export default client;





import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

// Auth middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  };
});

// Upload link (replaces createHttpLink)
const uploadLink = createUploadLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'include',
});

// Final Apollo Client
const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Chain auth with upload
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;


