// imports externos
import { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSnackbar } from 'notistack';
import {
  Button,
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
// imports locais
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import { getError } from '../../utils/error';
import { IActionsProps } from '../../interfaces/IActionsProps';
import { InitialOrder, IOrder } from '../../interfaces/IOrder';
import action from '../../components/ActionSnackbar';
import Layout from '../../components/Layout';

interface StateProps {
  loading: boolean;
  order: IOrder;
  error: string;
  loadingPay: boolean;
  successPay: boolean;
  errorPay: string;
  loadingDeliver: boolean;
  successDeliver: boolean;
  errorDeliver: string;
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
        order: action.payload,
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
    case 'PAY_REQUEST': {
      return {
        ...state,
        loadingPay: true,
        error: '',
      };
    }
    case 'PAY_SUCCESS': {
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    }
    case 'PAY_FAIL': {
      return {
        ...state,
        loadingPay: false,
        errorPay: action.payload,
      };
    }
    case 'PAY_RESET': {
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        errorPay: '',
      };
    }
    case 'DELIVER_REQUEST': {
      return {
        ...state,
        loadingDeliver: true,
        error: '',
      };
    }
    case 'DELIVER_SUCCESS': {
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: true,
      };
    }
    case 'DELIVER_FAIL': {
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: action.payload,
      };
    }
    case 'DELIVER_RESET': {
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
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
  const [
    {loading, error, order, successPay, loadingDeliver, successDeliver},
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    order: InitialOrder,
    error: '',
    loadingPay: false,
    successPay: false,
    errorPay: '',
    loadingDeliver: false,
    successDeliver: false,
    errorDeliver: '',
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
    paidAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }

    const fetchOrder = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'});

        const {data} = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });

        dispatch({type: 'FETCH_SUCCESS', payload: data});
        console.log(
          'RESPOSTA DA PÁGINA PEDIDOS NO GET POR ID: ' + JSON.stringify(data),
        );
      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();

      if (successPay) {
        dispatch({type: 'PAY_RESET'});
      }

      if (successDeliver) {
        dispatch({type: 'DELIVER_RESET'});
      }
    } else {
      const loadPaypalScript = async () => {
        const {data: clientId} = await axios.get('/api/keys/paypal', {
          headers: {authorization: `Bearer ${userInfo?.token}`},
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'BRL',
          },
        });

        paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
      };
      loadPaypalScript();
    }
  }, [
    order,
    successPay,
    successDeliver,
    // dispatch,
    // orderId,
    // order._id,
    // router,
    // userInfo,
    //paypalDispatch,
  ]);

  const createOrder = (data: any, actions: any) => {
    return actions.order
    .create({
      purchase_units: [
        {
          amount: {value: totalPrice},
        },
      ],
    })
    .then((orderID: any) => {
      return orderID;
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async function (details: any) {
      try {
        dispatch({type: 'PAY_REQUEST'});
        // @ts-ignore
        const {data} = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: {authorization: `Bearer ${userInfo?.token}`},
          },
        );
        dispatch({type: 'PAY_SUCCESS', payload: data});
      } catch (err) {
        dispatch({type: 'PAY_FAIL', payload: getError(err)});
        enqueueSnackbar(getError(err), {
          variant: 'error',
          action,
        });
      }
    });
  };

  const onError = (err: any) => {
    enqueueSnackbar(getError(err), {
      variant: 'error',
      action,
    });
  };

  const deliverOderHandler = async () => {
    try {
      dispatch({type: 'DELIVER_REQUEST'});
      // @ts-ignore
      const {data} = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: {authorization: `Bearer ${userInfo?.token}`},
        },
      );

      dispatch({type: 'DELIVER_SUCCESS', payload: data});
      enqueueSnackbar('Pedido foi enviado', {
        variant: 'success',
        action,
      });
    } catch (err) {
      dispatch({type: 'DELIVER_FAIL', payload: getError(err)});
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  return (
    <Layout title={`Pedido ${orderId}`}>
      <Typography component={'h1'} variant={'h1'}>
        Pedido ID: {orderId}
      </Typography>
      {loading ? (
        <CircularProgress/>
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
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
                          <TableCell>Imagem</TableCell>
                          <TableCell>Nome</TableCell>
                          <TableCell align={'right'}>Quantidade</TableCell>
                          <TableCell align={'right'}>Preço</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item.slug}`} passHref>
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
                              <NextLink href={`/product/${item.slug}`} passHref>
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
                          onError={onError}
                        />
                      </div>
                    )}
                  </ListItem>
                )}
                {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress/>}
                    <Button
                      onClick={deliverOderHandler}
                      fullWidth
                      variant={'contained'}
                      color={'primary'}
                    >
                      Enviar Pedido
                    </Button>
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

export default dynamic(() => Promise.resolve(Order), {ssr: false});
