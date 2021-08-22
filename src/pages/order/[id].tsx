// import dynamic from 'next/dynamic';
import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSnackbar } from 'notistack';

import {
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import { getError } from '../../utils/error';

import Layout from '../../components/Layout';
import action from '../../components/ActionSnackbar';
import { InitialOrder, IOrder } from '../../interfaces/IOrder';

interface ActionProps {
  type: string;
  payload?: any;
}

interface StateProps {
  loading: boolean,
  order: IOrder,
  error: string,
  loadingPay: boolean,
  successPay: boolean
  errorPay: string
}

// função reducer
function reducer(state: StateProps, action: ActionProps): StateProps {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return {
        ...state, loading: true, error: ''
      };
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state, loading: false, order: action.payload, error: ''
      };
    }
    case 'FETCH_FAIL': {
      return {
        ...state, loading: false, error: action.payload
      };
    }
    case 'PAY_REQUEST': {
      return {
        ...state, loadingPay: true
      };
    }
    case 'PAY_SUCCESS': {
      return {
        ...state, loadingPay: false, successPay: true,
      };
    }
    case 'PAY_FAIL': {
      return {
        ...state, loadingPay: false, errorPay: action.payload
      };
    }
    case 'PAY_RESET': {
      return {
        ...state, loadingPay: false, successPay: false, errorPay: ''
      };
    }
    default:
      return state;
  }
}

const Order = ({params}: any) => {
  const orderId = params.id;
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();

  const router: any = useRouter();
  const {state} = useContext(Store);
  const {userInfo} = state;

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
  const [{loading, error, order, successPay}, dispatch] = useReducer(reducer,
    {
      loading: true, order: InitialOrder, error: '',
      loadingPay: false, successPay: false, errorPay: ''
    });

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt
  } = order;


  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'});
        const {data} = await axios.get(`/api/orders/${orderId}`,
          {
            headers: {
              authorization: `Bearer ${userInfo?.token}`
            }
          });

        dispatch({type: 'FETCH_SUCCESS', payload: data});

      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder().then();
      if (successPay) {
        dispatch({type: 'PAY_RESET'});
      }
    } else {
      const loadPaypalScript = async () => {
        const {data: clientId} = await axios.get('/api/keys/paypal', {
          headers: {authorization: `Bearer ${userInfo?.token}`}
        });
        paypalDispatch({
          type: 'resetOptions', value: {
            'client-id': clientId,
            currency: 'BRL'
          }
        });

        paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
      };
      loadPaypalScript().then();
    }

  }, [dispatch, orderId, order._id, router, userInfo, paypalDispatch, successPay]);

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {amount: {value: totalPrice}}
      ]
    }).then((orderID: any) => {
      return orderID;
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async function (details: any) {
      try {
        dispatch({type: 'PAY_REQUEST'});
        // @ts-ignore
        const {data} = axios.put(`/api/orders/${order._id}/pay`,
          details, {
            headers: {authorization: `Bearer ${userInfo?.token}`}
          });
        dispatch({type: 'PAY_SUCCESS', payload: data});
        enqueueSnackbar('Pedido foi pago', {
          variant: 'success',
          action
        });
      } catch (err) {
        dispatch({type: 'PAY_FAIL', payload: getError(err)});
        enqueueSnackbar(getError(err), {
          variant: 'error',
          action
        });
      }
    });
  };

  const onError = (err: any) => {
    enqueueSnackbar(getError(err), {
      variant: 'error',
      action
    });
  };

  return (
    <Layout title={`Pedido ${orderId}`}>
      <Typography component={'h1'} variant={'h1'}>
        Pedido ID: {orderId}
      </Typography>
      {loading ? (
        <CircularProgress/>
      ) : error ? (
        <Typography className={classes.error}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            {/*dados do endereço de entrega*/}
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component={'h2'} variant={'h2'}>
                    Endereço para entrega
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress?.fullName}, {shippingAddress?.address},&nbsp;
                  {shippingAddress?.city}, {shippingAddress?.postalCode},&nbsp;
                  {shippingAddress?.country}
                </ListItem>
                <ListItem>
                  Status:&nbsp;
                  {isDelivered ? (
                    <Typography>
                      <strong>Enviado em {deliveredAt}</strong>
                    </Typography>
                  ) : (
                    <Typography>
                      <strong>Não enviado</strong>
                    </Typography>
                  )}
                </ListItem>
              </List>
            </Card>
            {/*dados da forma de pagamento*/}
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component={'h2'} variant={'h2'}>
                    Forma de pagamento
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Pagamento:&nbsp;
                  {isPaid ? (
                    <Typography>
                      <strong>Pago em {paidAt}</strong>
                    </Typography>
                  ) : (
                    <Typography>
                      <strong>Em aberto</strong>
                    </Typography>
                  )}
                </ListItem>
              </List>
            </Card>
            {/*lista de itens da compra*/}
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component={'h2'} variant={'h2'}>
                    Lista de Itens
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align={'right'}>Quantity</TableCell>
                          <TableCell align={'right'}>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.name}`} passHref>
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  />
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell>
                              <NextLink href={`/product/${item.name}`} passHref>
                                <Link>
                                  <Typography>{item.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell align={'right'}>
                              <Typography>{item.quantity}</Typography>
                            </TableCell>

                            <TableCell align={'right'}>
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            {/*dados do resumo da compra*/}
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant={'h2'}>Resumo</Typography>
                </ListItem>
                {/*valor total dos itens*/}
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Itens:</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography align={'right'}>R${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {/*valor imposto*/}
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Imposto:</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography align={'right'}>R${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {/*valor da taxa de entrega*/}
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Envio:</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography align={'right'}>R${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {/*valor total da compra*/}
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography align={'right'}>
                        <strong>R${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress/>
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}/>
                      </div>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export async function getServerSideProps({params}: any) {
  return {
    props: {params}
  };
}

export default Order;

// export default dynamic(() => Promise.resolve(CartScreen), {ssr: false});
