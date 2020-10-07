import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ApolloProvider, InMemoryCache, ApolloClient, from } from '@apollo/client';
import Channels from './Channel';
import Signup from './Auth/signup';
import Login from './Auth/login';

const client = new ApolloClient({
  uri: 'http://localhost:8000/gql',
  cache: new InMemoryCache(),
});
const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
      <nav>
          <ul>
            <li>
              <Link to="/channels">channels</Link>
            </li>
            <li>
              <Link to="/signup">signup</Link>
            </li>
            <li>
              <Link to="/login">login</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/channels">
            <Channels />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
