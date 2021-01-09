import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Channels from './Channel';
import Signup from './Auth/signup';
import Login from './Auth/login';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/gql',
});

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
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
const App = () => {
  const isAuthed = localStorage.getItem('token') ? true : false;
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/channels" component={!isAuthed ? Login : Channels} />
          <Route path="/login" component={!isAuthed ? Login : Login} />
          <Route path="/signup" component={!isAuthed ? Login : Signup} />
          <Route path="/" exact component={!isAuthed ? Login : Login} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
