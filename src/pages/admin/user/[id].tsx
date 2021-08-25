// Imports externos
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
// Imports locais
import { Store } from '../../../utils/Store';
import useStyles from '../../../utils/styles';
import { getError } from '../../../utils/error';
import action from '../../../components/ActionSnackbar';
import Layout from '../../../components/Layout';
import { IActionsProps } from '../../../interfaces/IActionsProps';

interface StateProps {
  loading: boolean;
  loadingUpdate: boolean;
  error: string;
  errorUpdate: string;
}

interface IFormUpdateUser {
  name: string;
  isAdmin: boolean;
}

function reducer(state: StateProps, action: IActionsProps): StateProps {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return {
        ...state,
        loading: true,
        error: '',
      };
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: '',
      };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    case 'UPDATE_REQUEST': {
      return {
        ...state,
        loadingUpdate: true,
        errorUpdate: '',
      };
    }
    case 'UPDATE_SUCCESS': {
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: '',
      };
    }
    case 'UPDATE_FAIL': {
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: action.payload,
      };
    }
    default:
      return state;
  }
}

const UserEdit = ({params}: any) => {
  const userId = params.id;
  const {enqueueSnackbar} = useSnackbar();
  const router: any = useRouter();
  const {state} = useContext(Store);
  const {userInfo} = state;

  const [{loading, error, loadingUpdate}, dispatch] = useReducer(reducer, {
    loading: false,
    loadingUpdate: false,
    error: '',
    errorUpdate: '',
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: {errors},
  } = useForm<IFormUpdateUser>();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      return router.push('/');
    } else {
      const fetchData = async () => {
        try {
          dispatch({type: 'FETCH_REQUEST'});
          const {data}: any = await axios.get(`/api/admin/users/${userId}`, {
            headers: {
              authorization: `Bearer ${userInfo?.token}`,
            },
          });
          setIsAdmin(data.isAdmin);
          dispatch({type: 'FETCH_SUCCESS'});
          setValue('name', data.name);
        } catch (err) {
          dispatch({type: 'FETCH_FAIL', payload: getError(err)});
        }
      };

      fetchData();
    }
  }, [userId, router, setValue, userInfo]);

  const submitHandler = async (userUpdate: IFormUpdateUser): Promise<void> => {
    const {name} = userUpdate;
    try {
      dispatch({type: 'UPDATE_REQUEST'});
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        {
          headers: {authorization: `Bearer ${userInfo?.token}`},
        },
      );

      dispatch({type: 'UPDATE_SUCCESS'});

      enqueueSnackbar('Usuário atualizado com sucesso!', {
        variant: 'success',
        action,
      });

      router.push('/admin/users');
    } catch (err) {
      dispatch({type: 'UPDATE_FAIL'});
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  const classes = useStyles();
  return (
    <Layout title={`Editar Produto ${userId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={'/admin/dashboard'}>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Admin Dashboard'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/orders'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Pedidos'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/products'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Produtos'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/users'} passHref>
                <ListItem selected button component={'a'}>
                  <ListItemText primary={'Usuários'}/>
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
                  Editar Usuário {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress/>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
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
                          rules={{required: true}}
                          render={({field}) => (
                            <TextField
                              disabled
                              variant={'outlined'}
                              fullWidth
                              id={'name'}
                              label={'Nome'}
                              error={Boolean(errors.name)}
                              helperText={
                                errors.name ? 'Nome é obrigatório!' : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>

                      <ListItem>
                        <FormControlLabel
                          label={'Administrador'}
                          control={
                            <Checkbox
                              onClick={(e: any) => setIsAdmin(e.target.checked)}
                              checked={isAdmin}
                              name={'isAdmin'}
                            />
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
                          Atualizar
                        </Button>
                        {loadingUpdate && <CircularProgress/>}
                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(UserEdit), {ssr: false});

export function getServerSideProps({params}: any) {
  return {
    props: {params}
  };
}