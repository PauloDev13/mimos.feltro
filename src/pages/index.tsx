// imports externos
import { useContext } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import type { NextPage } from 'next';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
// imports locais
import { Store } from '../utils/Store';
import db from '../utils/db';
import { IProduct } from '../interfaces/IProduct';
import Product from '../model/Product';
import action from '../components/ActionSnackbar';
import Layout from '../components/Layout';

interface IProducts {
  products: IProduct[];
}

const Home: NextPage<IProducts> = ({ products }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router: any = useRouter();
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product: IProduct): Promise<void> => {
    const existItem = state.cart.cartItems.find(
      (item: IProduct) => item._id === product._id,
    );
    const quantity = existItem ? existItem.quantity! + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      // window.alert('Desculpe. Esse produto está fora de estoque!');
      enqueueSnackbar('Desculpe. Produto sem estoque!', {
        variant: 'error',
        action,
      });
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    await router.push('/cart');
  };
  return (
    <Layout>
      <div>
        <h1>Produtos</h1>
        <Grid container spacing={3}>
          {products.map((product: IProduct) => (
            <Grid item md={4} key={product._id}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component={'img'}
                      image={product.image}
                      title={product.name}
                    />
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>R$ {product.price}</Typography>
                  <Button
                    onClick={() => addToCartHandler(product)}
                    size={'small'}
                    color={'primary'}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};
export default Home;

export async function getServerSideProps() {
  await db.connect();
  const products: IProduct[] = await Product.find({}).lean();
  await db.disconnected();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
