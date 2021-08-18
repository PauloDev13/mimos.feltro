import type { NextPage } from 'next';
//import dynamic from 'next/dynamic';
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
import NextLink from 'next/link';

import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../model/Product';
import { IProduct } from '../interfaces/IProduct';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';

interface IProducts {
  products: IProduct[];
}

const Home: NextPage<IProducts> = ({ products }) => {
  const router: any = useRouter();
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product: IProduct) => {
    const existItem = state.cart.cartItems.find(
      (item: IProduct) => item._id === product._id,
    );
    const quantity = existItem ? existItem.quantity! + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Desculpe. Esse produto está fora de estoque!');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    await router.push('/cart');
  };
  return (
    <Layout>
      <div>
        <h1>Products</h1>
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
                  <Typography>${product.price}</Typography>
                  <Button
                    onClick={() => addToCartHandler(product)}
                    size={'small'}
                    color={'primary'}
                  >
                    Add to cart
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

// export default dynamic(() => Promise.resolve(Home), { ssr: false });

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
