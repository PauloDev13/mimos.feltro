import React, { useContext, useState } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
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
  // children?: React.ReactNode;
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
        main: darkMode ? '#f0c000' : '#082578',
      },
      secondary: {
        main: darkMode ? '#208080' : '#043a3a',
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

  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippingAddress');
    router.push('/');
  };
  // @ts-ignore
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
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
                <Typography className={classes.brand}>amazonas</Typography>
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
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
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
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href={'/login'} passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>
          {children as React.ReactFragment}
        </Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Amazona</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};
export default dynamic(() => Promise.resolve(Layout), {ssr: false});
// export default Layout;