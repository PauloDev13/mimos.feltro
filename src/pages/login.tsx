import axios from 'axios';
import Layout from '../components/Layout';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';

import useStyles from '../utils/styles';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e: any) => {
    e.preventDefault();
    await axios.post('/api/users/login', {email, password})
    .then(() => {
      return alert('Login realizado com sucesso.');
    }).catch(err => alert(err.response.data ? err.response.data.message : err.message));
    // try {
    //   const {data} = await axios.post('/api/users/login', {email, password});
    //   alert('Login realizado com sucesso.');
    // } catch (err) {
    //   alert(err);
    // }
  };

  const classes = useStyles();
  return (
    <Layout title={'Login'}>
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component={'h1'} variant={'h1'}>
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'email'}
              label={'Email'}
              inputProps={{type: 'email'}}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'password'}
              label={'Password'}
              inputProps={{type: 'password'}}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </ListItem>
          <ListItem>
            <Button
              variant={'contained'}
              type={'submit'}
              fullWidth
              color={'primary'}
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            Ainda não é cadastrado? &nbsp;
            <NextLink href={'/register'} passHref>
              <Link>Faça seu cadastro aqui</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
//export default Login;
export default dynamic(() => Promise.resolve(Login), {ssr: false});