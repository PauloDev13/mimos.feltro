// imports externos
import { useContext } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
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
// imports locais
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import { IProduct } from '../interfaces/IProduct';
import action from '../components/ActionSnackbar';
import Layout from '../components/Layout';

const CartScreen = () => {
  const {enqueueSnackbar} = useSnackbar();
  const router: any = useRouter();
  const classes = useStyles();

  const {state, dispatch} = useContext(Store);
  const {
    cart: {cartItems},
  } = state;

  const updateCartHandler = async (item: IProduct, quantity: Number): Promise<void> => {
    const {data} = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar('Desculpe. Produto sem estoque!', {
        variant: 'error',
        action
      });
      // window.alert('Desculpe. Esse produto está fora de estoque!');
      return;
    }
    dispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
  };

  const removeItemHandler = async (item: IProduct): Promise<void> => {
    dispatch({type: 'CART_REMOVE_ITEM', payload: item});
  };

  const checkoutHandler = async (): Promise<void> => {
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
                    <TableCell>Imagem</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell align={'right'}>Quantidade</TableCell>
                    <TableCell align={'right'}>Preço</TableCell>
                    <TableCell align={'right'}>Ação</TableCell>
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

                      <TableCell align={'right'}>R$ {item.price}</TableCell>

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
                    Subtotal ({cartItems.reduce((a, c) => a + Number(c.quantity), 0)} &nbsp;
                    {cartItems.reduce((a, c) => a + Number(c.quantity), 0) > 1 ? 'itens' : 'item'}):
                    R$ {cartItems.reduce((a, c) => a + c.quantity! * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={checkoutHandler}
                    variant={'contained'}
                    color={'primary'}
                    fullWidth
                  >
                    Concluir Pedido
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
// export default CartScreen;
export default dynamic(() => Promise.resolve(CartScreen), {ssr: false});