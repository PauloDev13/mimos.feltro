import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';

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
import { Store } from '../../utils/Store';
import { getError } from '../../utils/error';
import useStyles from '../../utils/styles';

import Layout from '../../components/Layout';

interface ActionProps {
  type: string;
  payload?: any;
}

interface StateProps {
  loading: boolean;
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
    default:
      return state;
  }
}

const AdminProduct = () => {
  const router: any = useRouter();
  const { state } = useContext(Store);
  const [{ loading, products, error }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const { userInfo } = state;
  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData().then();
  }, [userInfo, router]);

  return (
    <Layout title={'Produtos'}>
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
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

        <Grid item md={10} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h1'} variant={'h1'}>
                  Pedidos
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
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
                              </NextLink>{' '}
                              &nbsp;
                              <Button size={'small'} variant={'contained'}>
                                Delete
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
export default AdminProduct;