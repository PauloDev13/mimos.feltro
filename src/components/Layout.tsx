import {useContext} from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

import {
  AppBar,
  Badge,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography
} from '@material-ui/core';
import useStyles from '../utils/styles';
import {Store} from '../utils/Store';
import {NextPage} from 'next';
import Cookies from 'js-cookie';

interface LayoutProps {
  title?: string;
  description?: string;
  children?: any;
}

const Layout: NextPage<LayoutProps> = ({title, description, children}) => {
  const {state, dispatch} = useContext(Store);
  const {darkMode, cart} = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0'
      }
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#f0c000' : '#082578'
      },
      secondary: {
        main: darkMode ? '#208080' : '#043a3a'
      }
    }
  });

  const classes = useStyles();

  const darkModeHandler = () => {
    dispatch({type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'});
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  // @ts-ignore
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}</title>
        {description && <meta name={'description'} content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <AppBar className={classes.navbar} position={'static'}>
          <Toolbar>
            <NextLink href={'/'} passHref>
              <Link>
                <Typography className={classes.brand}>amazonas</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch checked={darkMode} onChange={darkModeHandler}/>
              <NextLink href={'/cart'} passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge color={'secondary'} badgeContent={cart.cartItems.length}>
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              <NextLink href={'/login'} passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>
          {children}
        </Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Amazona</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;