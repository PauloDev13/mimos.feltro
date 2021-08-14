import type {NextPage} from 'next';
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography} from '@material-ui/core';
import NextLink from 'next/link';

import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../model/Product';
import {IProduct} from '../interfaces/IProduct';

interface IProducts {
  products: IProduct[];
}

const Home: NextPage<IProducts> = ({products}) => {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product: IProduct) => (
            <Grid item md={4} key={product.slug}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia component={'img'} image={product.image} title={product.name}>
                    </CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size={'small'} color={'primary'}>
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

export async function getServerSideProps() {
  await db.connect();
  const products: IProduct[] = await Product.find({}).lean();
  await db.disconnected();

  return {
    props: {
      products: products.map(db.convertDocToObj)
    }
  };
}
