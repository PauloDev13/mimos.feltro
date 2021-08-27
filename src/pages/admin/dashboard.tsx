import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
// imports locais
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import { getError } from '../../utils/error';
import { IActionsProps } from '../../interfaces/IActionsProps';
import Layout from '../../components/Layout';

interface StateProps {
  loading: boolean;
  summary: any;
  error: string;
}

function reducer(state: StateProps, action: IActionsProps): StateProps {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return {
        ...state,
        loading: true,
        error: '',
      };
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state,
        loading: false,
        summary: action.payload,
        error: '',
      };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
}

const AdminDashboard = () => {
  const router: any = useRouter();
  const { state } = useContext(Store);
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  const { userInfo } = state;
  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []); //[userInfo, router]);

  return (
    <Layout title={'Histórico de Pedidos'}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={'/admin/dashboard'}>
                <ListItem selected button component={'a'}>
                  <ListItemText primary={'Admin Dashboard'} />
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/orders'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Pedidos'} />
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/products'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Produtos'} />
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/users'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Usuários'} />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant={'h1'}>
                            R$ {summary.ordersPrice}
                          </Typography>
                          <Typography>Vendas</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={'/admin/orders'} passHref>
                            <Button size={'small'} color={'primary'}>
                              Exibir vendas
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant={'h1'}>
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Pedidos</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={'/admin/orders'} passHref>
                            <Button size={'small'} color={'primary'}>
                              Exibir pedidos
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant={'h1'}>
                            {summary.productsCount}
                          </Typography>
                          <Typography>Produtos</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={'/admin/products'} passHref>
                            <Button size={'small'} color={'primary'}>
                              Exibir produtos
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>

                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant={'h1'}>
                            {summary.usersCount}
                          </Typography>
                          <Typography>Usuários</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href={'/admin/users'} passHref>
                            <Button size={'small'} color={'primary'}>
                              Exibir usuários
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component={'h1'} variant={'h1'}>
                  Gráfico de vendas
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x: any) => x._id),
                    datasets: [
                      {
                        label: 'Vendas',
                        backgroundColor: 'rgba(162, 222, 208, 1)',
                        data: summary.salesData.map((x: any) => x.totalSales),
                      },
                    ],
                  }}
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(AdminDashboard), {ssr: false});
