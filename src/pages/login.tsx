// imports externos
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';
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
// imports locais
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import { getError } from '../utils/error';
import { IFormValues } from '../interfaces/IFormValues';
import action from '../components/ActionSnackbar';
import Layout from '../components/Layout';

const Login = () => {
  const router: any = useRouter();

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<IFormValues>();

  const {enqueueSnackbar} = useSnackbar();

  const {state, dispatch} = useContext(Store);
  const {redirect} = router.query;

  const {userInfo} = state;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect || '/');
    }
  }, []); //[router, userInfo, redirect]);

  const submitHandler = async ({email, password}: IFormValues): Promise<void> => {
    try {
      const {data} = await axios.post('/api/users/login', {
        email,
        password,
      });

      dispatch({type: 'USER_LOGIN', payload: data});
      Cookies.set('userInfo', JSON.stringify(data));

      await router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  const classes = useStyles();
  return (
    <Layout title={'Login'}>
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component={'h1'} variant={'h1'}>
          Acesso ao Sistema
        </Typography>
        <List>
          <ListItem>
            <Controller
              name={'email'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({field}) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'email'}
                  label={'Email'}
                  inputProps={{type: 'email'}}
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
              render={({field}) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'password'}
                  label={'Senha'}
                  inputProps={{type: 'password'}}
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
            <Button
              variant={'contained'}
              type={'submit'}
              fullWidth
              color={'primary'}
            >
              Entrar
            </Button>
          </ListItem>
          <ListItem>
            Não tem cadastro? &nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>Cadastre-se aqui</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Login;