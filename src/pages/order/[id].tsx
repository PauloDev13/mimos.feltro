// import dynamic from 'next/dynamic';
import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

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

import Layout from '../../components/Layout';
import CheckoutWizard from '../../components/CheckoutWizard';
import { getError } from '../../utils/error';
import { InitialOrder, IOrder } from '../../interfaces/IOrder';

interface ActionProps {
  type: string;
  payload?: any;
}

interface StateProps {
  loading: boolean,
  order: IOrder,
  error: string,
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
    default:
      return state;
  }
}

const Order = ({params}: any) => {
  const orderId = params.id;
  const router: any = useRouter();
  const {state} = useContext(Store);
  const {userInfo} = state;

  const classes = useStyles();
  const [{loading, error, order}, dispatch] = useReducer(reducer,
    {loading: true, order: InitialOrder, error: ''});

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

    if (!order._id || order._id && order._id !== orderId) {
      fetchOrder().then();
    }

  }, [dispatch, orderId, order._id, router, userInfo]);

  return (
    <Layout title={`Pedido ${orderId}`}>
      <CheckoutWizard activeStep={3}/>
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
