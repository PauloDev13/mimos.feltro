import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import NextLink from 'next/link';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import Layout from '../components/Layout';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';

import useStyles from '../utils/styles';
import { Store } from '../utils/Store';

const Register = () => {
  const router: any = useRouter();
  const { redirect }: any = router.query;

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/').then();
    }
  }, [router, userInfo]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Senhas não conferem!');
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      await router.push(redirect || '/');
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };

  const classes = useStyles();
  return (
    <Layout title={'Register'}>
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component={'h1'} variant={'h1'}>
          Register
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'name'}
              label={'Name'}
              inputProps={{ type: 'text' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </ListItem>

          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'email'}
              label={'Email'}
              inputProps={{ type: 'email' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </ListItem>

          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'password'}
              label={'Password'}
              inputProps={{ type: 'password' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </ListItem>
          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'confirmPassword'}
              label={'Confirm Password'}
              inputProps={{ type: 'password' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
          </ListItem>
          <ListItem>
            <Button
              variant={'contained'}
              type={'submit'}
              fullWidth
              color={'primary'}
            >
              Register
            </Button>
          </ListItem>
          <ListItem>
            Já possui cadastro? &nbsp;
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Faça login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Register;
// export default dynamic(() => Promise.resolve(Login), {ssr: false});