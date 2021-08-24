import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';

import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
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

import { IOrder } from '../interfaces/IOrder';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';
import useStyles from '../utils/styles';

import Layout from '../components/Layout';

interface ActionProps {
  type: string;
  payload?: any;
}

interface StateProps {
  loading: boolean;
  orders: IOrder[];
  error: string;
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
        orders: action.payload,
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

const OrderHistory = () => {
  const router: any = useRouter();
  const { state } = useContext(Store);
  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  const { userInfo } = state;
  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        console.log('PÁGINA HISTORY' + JSON.stringify(orders));
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders().then();
  }, [userInfo, router, orders]);

  return (
    <Layout title={'Histórico de Pedidos'}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <NextLink href={'/profile'}>
              <ListItem button component={'a'}>
                <ListItemText primary={'Perfil do usuário'} />
              </ListItem>
            </NextLink>
            <NextLink href={'/order-history'} passHref>
              <ListItem selected button component={'a'}>
                <ListItemText primary={'Histórico de pedidos'} />
              </ListItem>
            </NextLink>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h1'} variant={'h1'}>
                  Histórico de Pedidos
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    {orders.length === 0 ? (
                      <Typography component={'h2'} variant={'h2'}>
                        Não há pedidos! &nbsp;
                        <NextLink href={'/'} passHref>
                          <Link>Que tal começar clicando aqui?</Link>
                        </NextLink>
                      </Typography>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>DATA</TableCell>
                            <TableCell>TOTAL</TableCell>
                            <TableCell>PAGOS</TableCell>
                            <TableCell>ENVIADOS</TableCell>
                            <TableCell>AÇÃO</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                {order._id.substring(20, 24)}
                              </TableCell>
                              <TableCell>{order.createdAt}</TableCell>
                              <TableCell>R$ {order.totalPrice}</TableCell>
                              <TableCell>
                                {order.isPaid
                                  ? `pago em ${order.paidAt}`
                                  : 'em aberto'}
                              </TableCell>
                              <TableCell>
                                {order.isDelivered
                                  ? `enviado em ${order.deliveredAt}`
                                  : 'não enviado'}
                              </TableCell>
                              <TableCell>
                                <NextLink href={`/order/${order._id}`} passHref>
                                  <Button variant={'contained'}>
                                    Detalhes
                                  </Button>
                                </NextLink>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
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
export default OrderHistory;