import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
// import dynamic from 'next/dynamic';
import {
  Button,
  Card,
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
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';

const PlaceOrder = () => {
  const router: any = useRouter();
  const classes = useStyles();

  const {state, dispatch} = useContext(Store);
  const {
    cart: {cartItems, shippingAddress, paymentMethod},
  } = state;
  // const {cartItems} = state.cart
  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; //123.456 => 123.46
  const itemPrice = round2(
    cartItems.reduce((a, c) => a + c.price * Number(c.quantity), 0),
  );
  const shippingPrice = itemPrice > 200 ? 0 : 15.0;
  const taxPrice = round2(itemPrice * 0.15);
  const totalPrice = round2(itemPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router])

  return (
    <Layout title={'Carrinho de compras'}>
      <CheckoutWizard activeStep={3}/>
      <Typography component={'h1'} variant={'h1'}>
        Ordem de Compra
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component={'h2'} variant={'h2'}>
                  Endereço para entrega
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address},&nbsp;
                {shippingAddress.city}, {shippingAddress.postalCode},&nbsp;
                {shippingAddress.country}
              </ListItem>
            </List>
          </Card>
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
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant={'h2'}>Resumo da compra</Typography>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Itens:</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography align={'right'}>R${itemPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

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
              <ListItem>
                <Button variant={'contained'} color={'primary'} fullWidth>
                  Finalizar Compra
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default PlaceOrder;
// export default dynamic(() => Promise.resolve(CartScreen), {ssr: false});