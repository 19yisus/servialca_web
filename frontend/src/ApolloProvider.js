import React from 'react';
import App from './App';
/* import ApolloClient from '@apollo/react-hooks'; */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/client/react';


let op = require('../public/modulos/datos')

const httpLink = createHttpLink({

 uri: op.conexion+'/graphql'
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);