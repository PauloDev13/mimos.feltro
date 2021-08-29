import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';

import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';
import action from '../components/ActionSnackbar';

interface LayoutProps {
  title?: string;
  description?: string;
}

const Layout: NextPage<LayoutProps> = ({ title, description, children }) => {
  const router: any = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [categories, setCategories] = useState(['']);

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#d980d5' : '#8c0786',
      },
      secondary: {
        main: darkMode ? '#d980d5' : '#8c0786',
      },
    },
  });

  const darkModeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e: any, redirect: string) => {
    setAnchorEl(null);

    if (redirect) {
      router.push(redirect);
    }
  };

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), {
        variant: 'error',
        action,
      });
    }
  };

  useEffect(() => {
    fetchCategories().then();
  }, []);

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippingAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  // @ts-ignore
  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - Next Mimos Feltro` : 'Next  Mimos Feltro'}
        </title>
        {description && (
          <meta name={'description'} content={description}></meta>
        )}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar className={classes.navbar} position={'static'}>
          <Toolbar className={classes.toolbar}>
            <Box display={'flex'} alignItems={'center'}>
              <IconButton
                onClick={sidebarOpenHandler}
                edge={'start'}
                aria-label={'open drawer'}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href={'/'} passHref>
                <Link>
                  <Image
                    src={'/images/logo_mascote.png'}
                    height={'60vh'}
                    width={'100vh'}
                    alt={'Logomarca'}
                  />
                  {/*<Typography className={classes.brand}>Mimos Feltro</Typography>*/}
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor={'left'}
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Typography>Compras por categoria</Typography>
                    <IconButton
                      onClick={sidebarCloseHandler}
                      aria-label={'close'}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      onClick={sidebarCloseHandler}
                      button
                      component={'a'}
                    >
                      <ListItemText primary={category} />
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div className={classes.grow}></div>
            <div>
              <Switch checked={darkMode} onChange={darkModeHandler} />
              <NextLink href={'/cart'} passHref>
                <Link>
                  <Typography component={'span'}>
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color={'secondary'}
                        badgeContent={cart.cartItems.length}
                      >
                        Seu Carrinho
                      </Badge>
                    ) : (
                      'Seu Carrinho'
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo?.name ? (
                <>
                  <Button
                    className={classes.navbarButton}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Perfil
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Histórico de pedidos
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Sair</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href={'/login'} passHref>
                  <Link>
                    <Typography component={'span'}>Entrar</Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>
          {children as React.ReactFragment}
        </Container>
        <footer className={classes.footer}>
          <Typography>
            Todos os direitos reservados. Next Mimos Feltro
          </Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};
export default dynamic(() => Promise.resolve(Layout), {ssr: false});
// export default Layout;