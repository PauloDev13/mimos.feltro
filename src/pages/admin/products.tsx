// imports externos
import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
// imports locais
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import { getError } from '../../utils/error';

import { IActionsProps } from '../../interfaces/IActionsProps';
import action from '../../components/ActionSnackbar';
import Layout from '../../components/Layout';

interface StateProps {
  loading: boolean;
  loadingCreate: boolean;
  loadingDelete: boolean;
  successDelete: boolean;
  products: ISummaryProduct[];
  error: string;
}

interface ISummaryProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  countInStock: number;
  rating: number;
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
        products: action.payload,
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
    case 'CREATE_REQUEST': {
      return {
        ...state,
        loadingCreate: true,
      };
    }
    case 'CREATE_SUCCESS': {
      return {
        ...state,
        loadingCreate: false,
      };
    }
    case 'CREATE_FAIL': {
      return {
        ...state,
        loadingCreate: false,
      };
    }
    case 'DELETE_REQUEST': {
      return {
        ...state,
        loadingDelete: true,
      };
    }
    case 'DELETE_SUCCESS': {
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    }
    case 'DELETE_FAIL': {
      return {
        ...state,
        loadingDelete: false,
      };
    }
    case 'DELETE_RESET': {
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    }
    default:
      return state;
  }
}

const AdminProduct = () => {
  const router: any = useRouter();
  const {state} = useContext(Store);
  const [
    {loading, products, error, loadingCreate, loadingDelete, successDelete},
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    loadingCreate: false,
    loadingDelete: false,
    successDelete: false,
    products: [],
    error: '',
  });

  const {userInfo} = state;
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();

  const createHandler = async () => {
    if (!window.confirm('Criar um novo produto?')) {
      return;
    }

    try {
      dispatch({type: 'CREATE_REQUEST'});

      const {data} = await axios.post(
        `/api/admin/products`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );

      dispatch({type: 'CREATE_SUCCESS'});
      enqueueSnackbar('Produto criado com sucesso', {
        variant: 'success',
        action,
      });
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({type: 'CREATE_FAIL'});
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  const deleteHandler = async (productId: string) => {
    if (!window.confirm('Excluir o produto?')) {
      return;
    }

    try {
      dispatch({type: 'DELETE_REQUEST'});
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: {
          authorization: `Bearer ${userInfo?.token}`,
        },
      });

      dispatch({type: 'DELETE_SUCCESS'});
      enqueueSnackbar('Produto excluído com sucesso', {
        variant: 'success',
        action,
      });
    } catch (err) {
      dispatch({type: 'DELETE_FAIL'});
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'});
        const {data} = await axios.get(`/api/admin/products`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });

        dispatch({type: 'FETCH_SUCCESS', payload: data});
      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    if (successDelete) {
      dispatch({type: 'DELETE_RESET'});
    } else {
      fetchData();
    }
  }, [successDelete]); // [userInfo, router, successDelete]);

  return (
    <Layout title={'Produtos'}>
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
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
                <ListItem selected button component={'a'}>
                  <ListItemText primary={'Produtos'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/users'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Usuários'}/>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container>
                  <Grid alignItems={'flex-start'} item xs={6}>
                    <Typography component={'h1'} variant={'h1'}>
                      Produtos
                    </Typography>
                    {loadingDelete && <CircularProgress/>}
                  </Grid>
                  <Grid alignItems={'flex-end'} item xs={6}>
                    <Button
                      onClick={createHandler}
                      color={'primary'}
                      variant={'contained'}
                    >
                      Novo produto
                    </Button>
                    {loadingCreate && <CircularProgress/>}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress/>
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NOME</TableCell>
                          <TableCell align={'right'}>PREÇO</TableCell>
                          <TableCell>CATEGORIA</TableCell>
                          <TableCell align={'center'}>ESTOQUE</TableCell>
                          <TableCell align={'center'}>AVALIAÇÃO</TableCell>
                          <TableCell align={'center'}>AÇÃO</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell align={'right'}>
                              R$ {product.price}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell align={'center'}>
                              {product.countInStock}
                            </TableCell>
                            <TableCell align={'center'}>
                              {product.rating}
                            </TableCell>
                            <TableCell align={'center'}>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button size={'small'} variant={'contained'}>
                                  Editar
                                </Button>
                              </NextLink>
                              &nbsp;
                              <Button
                                onClick={() => deleteHandler(product._id)}
                                size={'small'}
                                variant={'contained'}
                              >
                                Excluir
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(AdminProduct), {ssr: false});