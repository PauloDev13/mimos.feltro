// imports externos
import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
// imports locais
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import { getError } from '../../utils/error';
import { IActionsProps } from '../../interfaces/IActionsProps';
import action from '../../components/ActionSnackbar';
import Layout from '../../components/Layout';

interface StateProps {
  loading: boolean;
  loadingDelete: boolean;
  successDelete: boolean;
  users: ISummaryUsers[];
  error: string;
}

interface ISummaryUsers {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
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
        users: action.payload,
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
    case 'DELETE_REQUEST': {
      return {
        ...state,
        loadingDelete: true,
      };
    }
    case 'DELETE_SUCCESS': {
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    }
    case 'DELETE_FAIL': {
      return {
        ...state,
        loadingDelete: false,
      };
    }
    case 'DELETE_RESET': {
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    }
    default:
      return state;
  }
}

const AdminUser = () => {
  const router: any = useRouter();
  const {state} = useContext(Store);
  const [{loading, users, error, loadingDelete, successDelete}, dispatch] =
    useReducer(reducer, {
      loading: false,
      loadingDelete: false,
      successDelete: false,
      users: [],
      error: '',
    });

  const {userInfo} = state;
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();

  const deleteHandler = async (userId: string) => {
    if (!window.confirm('Excluir usuário?')) {
      return;
    }

    try {
      dispatch({type: 'DELETE_REQUEST'});
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          authorization: `Bearer ${userInfo?.token}`,
        },
      });

      dispatch({type: 'DELETE_SUCCESS'});
      enqueueSnackbar('Usuário excluído com sucesso', {
        variant: 'success',
        action,
      });
    } catch (err) {
      dispatch({type: 'DELETE_FAIL'});
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    const fetchData = async () => {
      try {
        dispatch({type: 'FETCH_REQUEST'});
        const {data} = await axios.get(`/api/admin/users`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });

        dispatch({type: 'FETCH_SUCCESS', payload: data});
      } catch (err) {
        dispatch({type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    if (successDelete) {
      dispatch({type: 'DELETE_RESET'});
    } else {
      fetchData();
    }
  }, [successDelete]); // [userInfo, router, successDelete]);

  return (
    <Layout title={'Produtos'}>
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href={'/admin/dashboard'}>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Admin Dashboard'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/orders'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Pedidos'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/products'} passHref>
                <ListItem button component={'a'}>
                  <ListItemText primary={'Produtos'}/>
                </ListItem>
              </NextLink>

              <NextLink href={'/admin/users'} passHref>
                <ListItem selected button component={'a'}>
                  <ListItemText primary={'Usuários'}/>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography component={'h1'} variant={'h1'}>
                      Usuários
                    </Typography>
                    {loadingDelete && <CircularProgress/>}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress/>
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NOME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>ADMINISTRADOR</TableCell>
                          <TableCell align={'center'}>AÇÃO</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.isAdmin ? 'SIM' : 'NÃO'}
                            </TableCell>
                            <TableCell align={'center'}>
                              <NextLink
                                href={`/admin/user/${user._id}`}
                                passHref
                              >
                                <Button size={'small'} variant={'contained'}>
                                  Editar
                                </Button>
                              </NextLink>
                              &nbsp; &nbsp;
                              <Button
                                onClick={() => deleteHandler(user._id)}
                                size={'small'}
                                variant={'contained'}
                              >
                                Excluir
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(AdminUser), {ssr: false});
