// imports externos
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
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

import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import { getError } from '../utils/error';

import CheckoutWizard from '../components/CheckoutWizard';
import action from '../components/ActionSnackbar';
import Layout from '../components/Layout';

const PlaceOrder = () => {
  const router: any = useRouter();
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();

  const [loading, setLoading] = useState(false);

  const {state, dispatch} = useContext(Store);
  const {
    userInfo,
    cart: {cartItems, shippingAddress, paymentMethod},
  } = state;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; //123.456 => 123.46

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * Number(c.quantity), 0),
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15.0;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const placeOrderHandler = async (): Promise<void> => {
    try {
      setLoading(true);
      const {data} = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );

      dispatch({type: 'CART_CLEAR'});
      Cookies.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data._id}`);

    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []); // [paymentMethod, router, cartItems]);

  return (
    <Layout title={'Finalizando Pedido'}>
      <CheckoutWizard activeStep={3}/>
      <Typography component={'h1'} variant={'h1'}>
        Dados do Pedido
      </Typography>
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
                      {cartItems.map((item) => (
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
              {/*botão finalizar compra*/}
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant={'contained'}
                  color={'primary'}
                  fullWidth
                >
                  Finalizar Pedido
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress/>
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false});