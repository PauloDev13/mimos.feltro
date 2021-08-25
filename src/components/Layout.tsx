import React, { useContext, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
// import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Cookies from 'js-cookie';

import {
  AppBar,
  Badge,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';

interface LayoutProps {
  title?: string;
  description?: string;
}

const Layout: NextPage<LayoutProps> = ({ title, description, children }) => {
  const router: any = useRouter();

  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

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

  const classes = useStyles();

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
          <Toolbar>
            <NextLink href={'/'} passHref>
              <Link>
                <Typography className={classes.brand}>Mimos Feltro</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch checked={darkMode} onChange={darkModeHandler} />
              <NextLink href={'/cart'} passHref>
                <Link>
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
                  <Link>Entrar</Link>
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
// export default dynamic(() => Promise.resolve(Layout), {ssr: false});
export default Layout;