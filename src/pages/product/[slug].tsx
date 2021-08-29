// imports externos
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
// imports locais
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import useStyles from '../../utils/styles';
import { getError } from '../../utils/error';
import { IProduct } from '../../interfaces/IProduct';
import Product from '../../model/Product';
import action from '../../components/ActionSnackbar';
import Layout from '../../components/Layout';
import { IReview } from '../../interfaces/IReview';

interface ProductScreenProps {
  product: IProduct;
}

function ProductScreen(props: ProductScreenProps): ReactElement {
  const {enqueueSnackbar} = useSnackbar();
  const router: any = useRouter();
  const {state, dispatch} = useContext(Store);
  const {userInfo} = state;
  const {product} = props;
  const classes = useStyles();

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const {data} = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async (): Promise<void> => {
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

  const submitHandler = async (e: any) => {
    console.log('RATING ' + rating + ' COMMENT ' + comment);
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: {authorization: `Bearer ${userInfo?.token}`,}
        });
      setLoading(false);
      enqueueSnackbar('Comentário enviado com sucesso', {
        variant: 'success',
        action,
      });
      await fetchReviews();

    } catch (err) {
      setLoading(true);
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
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
              <Rating value={product.rating} readOnly/>
              <Link href={'#reviews'}>
                ({product.numReviews} avaliações)
              </Link>
              <Typography>
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
      <List>
        <ListItem>
          <Typography variant={'h2'} id={'reviews'}>
            Avaliação dos clientes
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>Sem avaliação</ListItem>}
        {reviews.map(review => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{String(review.createdAt).substring(0, 10)}</Typography>
              </Grid>
              <Grid>
                <Rating value={review.rating} readOnly/>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography>Deixe seu comentário</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant={'outlined'}
                    fullWidth
                    name={'review'}
                    label={'Comentário'}
                    value={comment}
                    onChange={(e: any) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name={'simple-controlled'}
                    value={rating}
                    onChange={(e: any) => setRating(Number(e.target.value))}/>
                </ListItem>
                <ListItem>
                  <Button
                    type={'submit'}
                    fullWidth
                    variant={'contained'}
                    color={'primary'}
                  >
                    Enviar
                  </Button>
                  {loading && <CircularProgress/>}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant={'h2'}>
              Por favor faça &nbsp;
              <Link href={`/login?redirect=/product/${product.slug}`}>Login</Link>
              &nbsp; para fazer sua avaliação.
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
}


export async function getServerSideProps(context: any) {
  const {params} = context;
  const {slug} = params;
  await db.connect();
  const product: IProduct = await Product.findOne({slug}, '-reviews').lean();
  await db.disconnected();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}

export default dynamic(() => Promise.resolve(ProductScreen), {ssr: false});
