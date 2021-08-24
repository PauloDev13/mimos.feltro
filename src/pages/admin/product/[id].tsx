import React, { useContext, useEffect, useReducer } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
// import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';

import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';

import useStyles from '../../../utils/styles';
import { Store } from '../../../utils/Store';
import { getError } from '../../../utils/error';

import Layout from '../../../components/Layout';
import action from '../../../components/ActionSnackbar';
import { IFormUpdateProducts } from '../../../interfaces/IFormValues';

interface ActionProps {
  type: string;
  payload?: any;
}

interface StateProps {
  loading: boolean;
  loadingUpdate: boolean;
  error: string;
  errorUpdate: string;
}

const ProductEdit = ({ params }: any) => {
  const productId = params.id;
  const { enqueueSnackbar } = useSnackbar();
  const router: any = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpdate: false,
    error: '',
    errorUpdate: '',
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IFormUpdateProducts>();

  function reducer(state: StateProps, action: ActionProps): StateProps {
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

  useEffect(() => {
    if (!userInfo) {
      return router.push('/');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data }: any = await axios.get(
            `/api/admin/products/${productId}`,
            {
              headers: {
                authorization: `Bearer ${userInfo?.token}`,
              },
            },
          );

          dispatch({ type: 'FETCH_SUCCESS' });

          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('category', data.category);
          setValue('brand', data.brand);
          setValue('countInStock', data.countInStock);
          setValue('description', data.description);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };

      fetchData();
    }
  }, [productId, router, setValue, userInfo]);

  const submitHandler = async (productUpdate: IFormUpdateProducts) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          productUpdate,
        },
        {
          headers: { authorization: `Bearer ${userInfo?.token}` },
        },
      );

      dispatch({ type: 'UPDATE_SUCCESS' });

      enqueueSnackbar('Produto atualizado com sucesso!', {
        variant: 'success',
        action,
      });

      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL' });
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  const classes = useStyles();
  return (
    <Layout title={`Editar Produto ${productId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={'/admin/dashboard'}>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Admin Dashboard'} />
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/orders'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Pedidos'} />
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/products'} passHref>
                <ListItem selected button component={'a'}>
                  <ListItemText primary={'Produtos'} />
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
                  Editar Produto {productId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
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
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
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
                        <Controller
                          name={'slug'}
                          control={control}
                          defaultValue={''}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              id={'slug'}
                              label={'Slug'}
                              error={Boolean(errors.slug)}
                              helperText={
                                errors.slug ? 'Slug é obrigatório!' : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name={'price'}
                          control={control}
                          defaultValue={0}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              id={'price'}
                              label={'Preço'}
                              error={Boolean(errors.price)}
                              helperText={
                                errors.price ? 'Preço é obrigatório!' : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name={'image'}
                          control={control}
                          defaultValue={''}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              id={'image'}
                              label={'Imagem'}
                              error={Boolean(errors.image)}
                              helperText={
                                errors.image ? 'Imagem é obrigatório!' : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name={'category'}
                          control={control}
                          defaultValue={''}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              id={'category'}
                              label={'Categoria'}
                              error={Boolean(errors.category)}
                              helperText={
                                errors.category
                                  ? 'Categoria é obrigatório!'
                                  : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name={'brand'}
                          control={control}
                          defaultValue={''}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              id={'brand'}
                              label={'Marca'}
                              error={Boolean(errors.brand)}
                              helperText={
                                errors.brand ? 'Marca é obrigatório!' : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name={'countInStock'}
                          control={control}
                          defaultValue={0}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              id={'countInStock'}
                              label={'Estoque'}
                              error={Boolean(errors.countInStock)}
                              helperText={
                                errors.countInStock
                                  ? 'Estoque é obrigatório!'
                                  : ''
                              }
                              {...field}
                            />
                          )}
                        />
                      </ListItem>
                      <ListItem>
                        <Controller
                          name={'description'}
                          control={control}
                          defaultValue={''}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              multiline
                              id={'description'}
                              label={'Descrição'}
                              error={Boolean(errors.description)}
                              helperText={
                                errors.description
                                  ? 'Descrição é obrigatório!'
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
                        {loadingUpdate && <CircularProgress />}
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
export default ProductEdit;

// export default dynamic(() => Promise.resolve(Login), {ssr: false});let
export function getServerSideProps({params}: any) {
  return {
    props: {params}
  };
}