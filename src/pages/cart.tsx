import { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
// import dynamic from 'next/dynamic';
import axios from 'axios';

import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
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
import { IProduct } from '../interfaces/IProduct';

const CartScreen = () => {
  const router: any = useRouter();
  const classes = useStyles();

  const {state, dispatch} = useContext(Store);
  const {
    cart: {cartItems},
  } = state;
  // const {cartItems} = state.cart

  const updateCartHandler = async (item: IProduct, quantity: Number) => {
    const {data} = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Desculpe. Esse produto está fora de estoque!');
      return;
    }
    dispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
  };

  const removeItemHandler = async (item: IProduct) => {
    dispatch({type: 'CART_REMOVE_ITEM', payload: item});
  };

  const checkoutHandler = async () => {
    await router.push('/shipping');
  };

  return (
    <Layout title={'Carrinho de Compras'}>
      <Typography component={'h1'} variant={'h1'}>
        Carrinho de Compras
      </Typography>
      {cartItems.length === 0 ? (
        <div className={classes.divLink}>
          O Carrinho está vazio.{' '}
          <NextLink href={'/'} passHref>
            <Link>Que tal começar clicando aqui?</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align={'right'}>Quantity</TableCell>
                    <TableCell align={'right'}>Price</TableCell>
                    <TableCell align={'right'}>Action</TableCell>
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
                              layout={'responsive'}
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
                        <Select
                          value={item.quantity}
                          onChange={(e: any) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      <TableCell align={'right'}>${item.price}</TableCell>

                      <TableCell align={'right'}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant={'contained'}
                          color={'secondary'}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant={'h2'}>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity!, 0)}{' '}
                    items) : ${' '}
                    {cartItems.reduce((a, c) => a + c.quantity! * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={checkoutHandler}
                    variant={'contained'}
                    color={'primary'}
                    fullWidth
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};
export default CartScreen;
// export default dynamic(() => Promise.resolve(CartScreen), {ssr: false});