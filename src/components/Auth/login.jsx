import React, { useState } from 'react';
import {
  TextField,
  Container,
  CssBaseline,
  Typography,
  Grid,
  Button,
  Avatar,
  makeStyles,
  Link,
  Box,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useMutation, gql, from } from '@apollo/client';

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const Login = () => {
  const classes = useStyles();
  const [input, setInput] = useState({});
  const [login, { loading, error, data }] = useMutation(LOG_IN);
  const history = useHistory();
  if (error) {
    throw new Error('Fettching error in login mutation');
  }
  if (data) {
    console.log('ssss');
    localStorage.setItem('token', data.login.token);
    history.push('/channels');
  }
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
            onClick={(e) => {
              login({
                variables: {
                  input,
                },
              });
            }}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
};
export default Login;
