import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';

import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';
import { IFormValues } from '../interfaces/IFormValues';

import Layout from '../components/Layout';
import action from '../components/ActionSnackbar';
import NextLink from 'next/link';
import Cookies from 'js-cookie';

const Profile = () => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IFormValues>();

  const { enqueueSnackbar } = useSnackbar();

  const router: any = useRouter();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
    // setValue('password', userInfo.password);
  }, [router, userInfo, setValue]);

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
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        },
      );

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      enqueueSnackbar('Perfil atualizado com sucesso!', {
        variant: 'success',
        action,
      });
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  const classes = useStyles();
  return (
    <Layout title={'Perfil'}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={'/profile'}>
                <ListItem selected button component={'a'}>
                  <ListItemText primary={'Perfil do usuário'} />
                </ListItem>
              </NextLink>
              <NextLink href={'/order-history'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Histórico de pedidos'} />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h1'} variant={'h1'}>
                  Perfil
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
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
                            inputProps={{ type: 'text' }}
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
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Senha deve conter 6 o mais caracteres!',
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
                                ? 'Senha deve conter 6 o mais caracteres!'
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
                          validate: (value) =>
                            value === '' ||
                            String(value).length > 5 ||
                            'Confirmar a Senha deve conter 6 o mais caracteres!',
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
                                ? 'Confirmar a Senha deve conter 6 o mais caracteres!'
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
                        Atualizar
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Profile;
// export default dynamic(() => Promise.resolve(Login), {ssr: false});let