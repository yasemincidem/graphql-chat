import React, { useState, useEffect } from 'react';
import {
  TextField,
  Container,
  CssBaseline,
  Typography,
  Grid,
  Button,
  Avatar,
  Link,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useMutation, gql } from '@apollo/client';
import { useLoginStyles } from './styles';

const LOG_IN = gql`
  mutation Login($input: AuthInput!) {
    login(input: $input) {
      token
      user {
        _id
        email
        name
        surname
      }
    }
  }
`;

const Login = () => {
  const classes = useLoginStyles();
  const [input, setInput] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [login, { loading, error, data }] = useMutation(LOG_IN);
  const history = useHistory();

  // If we have multiple instances of useEffect in the component,
  // all the useEffect functions will be executed in the same order
  // as they are defined inside the component.
  useEffect(() => {
    if (input.email && input.password) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [input && Object.keys(input).length]);

  useEffect(() => {
    if (data && Object.keys(data).length) {
      localStorage.setItem('token', data.login.token);
      history.push('/channels', {params: data.login.user});
      history.go();
    }
  }, [data && Object.keys(data).length]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Typography color="error" component="h8" variant="h8">
          {error && error.message ? error.message : null}
        </Typography>
        <div className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setInput({ ...input, ...{ email: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setInput({ ...input, ...{ password: e.target.value } })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            loading={loading}
            disabled={!isValid}
            onClick={() =>
              login({
                variables: {
                  input,
                },
              })
            }
          >
            Sign in
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="register" variant="body2">
                Don't have an account? Register Now!
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
};
export default Login;
