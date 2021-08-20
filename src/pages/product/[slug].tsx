// import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
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
  Typography,
} from '@material-ui/core';

import action from '../../components/ActionSnackbar';

import useStyles from '../../utils/styles';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

import { IProduct } from '../../interfaces/IProduct';
import Product from '../../model/Product';

import Layout from '../../components/Layout';

interface ProductScreenProps {
  product: IProduct;
}

function ProductScreen(props: ProductScreenProps) {
  const {enqueueSnackbar} = useSnackbar();
  const router: any = useRouter();
  const {state, dispatch} = useContext(Store);
  const {product} = props;
  const classes = useStyles();

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
      (item: IProduct) => item._id === product._id,
    );
    const quantity = existItem ? (existItem.quantity as number) + 1 : 1;

    const {data} = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      // window.alert('Desculpe. Esse produto está fora de estoque!');
      enqueueSnackbar('Desculpe. Produto sem estoque!', {
        variant: 'error',
        action
      });
      return;
    }

    dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}});
    await router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href={'/'} passHref>
          <Link>
            <Typography>voltar para produtos</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            layout={'responsive'}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component={'h1'} variant={'h1'}>
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Categoria: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Marca: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Avaliação: {product.rating} estrelas ({product.numReviews} avaliações)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Descrição: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Preço</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>R$ {product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'Em estoque' : 'Indisponível'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={addToCartHandler}
                  fullWidth
                  variant={'contained'}
                  color={'primary'}
                >
                  Adicionar ao Carrinho
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default ProductScreen;

//export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });

export async function getServerSideProps(context: any) {
  const {params} = context;
  const {slug} = params;
  await db.connect();
  const product: IProduct = await Product.findOne({slug}).lean();
  await db.disconnected();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}