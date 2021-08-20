import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import NextLink from 'next/link';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

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
import { getError } from '../utils/error';
import { IFormValues } from '../interfaces/IFormValues';

import Layout from '../components/Layout';
import action from '../components/ActionSnackbar';

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormValues>();

  const { enqueueSnackbar } = useSnackbar();

  const router: any = useRouter();
  const { redirect } = router.query;

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [router, userInfo]);

  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }: IFormValues) => {
    if (password !== confirmPassword) {
      enqueueSnackbar('Senhas não conferem!', {
        variant: 'error',
        action,
      });
      return;
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      await router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
      });
    }
  };

  const classes = useStyles();
  return (
    <Layout title={'Register'}>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component={'h1'} variant={'h1'}>
          Cadastro
        </Typography>
        <List>
          <ListItem>
            <Controller
              name={'name'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'name'}
                  label={'Nome'}
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'O Nome deve conter 6 o mais caracteres!'
                        : 'Nome é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name={'email'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'email'}
                  label={'Email'}
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email inválido!'
                        : 'Email é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name={'password'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'password'}
                  label={'Senha'}
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Senha deve conter 6 o mais caracteres!'
                        : 'Senha é obrigatória!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name={'confirmPassword'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'confirmPassword'}
                  label={'Confirma Senha'}
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirme a Senha deve conter 6 o mais caracteres!'
                        : 'Confirmar Senha é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button
              variant={'contained'}
              type={'submit'}
              fullWidth
              color={'primary'}
            >
              Cadastro
            </Button>
          </ListItem>
          <ListItem>
            Já possui cadastro? &nbsp;
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Faça login aqui.</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Register;
// export default dynamic(() => Promise.resolve(Login), {ssr: false});