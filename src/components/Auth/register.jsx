import React, { useEffect, useState } from 'react';
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
import { useSignupStyles } from './styles';

const SIGN_UP = gql`
  mutation SignUp($input: AuthInput!) {
    signup(input: $input) {
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

const Register = () => {
  const classes = useSignupStyles();
  const [input, setInput] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [signup, { loading, error, data }] = useMutation(SIGN_UP);
  const history = useHistory();
  useEffect(() => {
    if (input.name && input.surname && input.email && input.password) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [input && Object.keys(input).length]);

  useEffect(() => {
    if (data && Object.keys(data).length) {
      localStorage.setItem('token', data.signup.token);
      history.push('/channels', {params: data.signup.user});
      history.go();
    }
  }, [data && Object.keys(data).length]);

  // TODO: You need to change firstname and lastname with username
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Typography color="error" component="h8" variant="h8">
          {error && error.message ? error.message : null}
        </Typography>
        <div className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                label="First Name"
                autoFocus
                onChange={(e) => setInput({ ...input, ...{ name: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={(e) => setInput({ ...input, ...{ surname: e.target.value } })}
              />
            </Grid>
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
            onClick={() => {
              console.log('input', input);
              return signup({
                variables: {
                  input,
                },
              })
            }
            }
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
};
export default Register;
