import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Channels from './Channel';
import Login from './Auth/login';
import Register from './Auth/register';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/gql',
});
const wsClient = new SubscriptionClient('ws://localhost:4000', {
  reconnect: true,
});
const wsLink = new WebSocketLink(wsClient);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
const App = () => {
  const isAuthed = localStorage.getItem('token') ? true : false;
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/channels" component={!isAuthed ? Login : Channels} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={!isAuthed ? Register : Login} />
          <Route path="/" exact component={Login} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
