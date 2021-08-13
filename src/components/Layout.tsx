import Head from 'next/head';
import NextLink from 'next/link';

import {AppBar, Container, createTheme, CssBaseline, Link, ThemeProvider, Toolbar, Typography} from '@material-ui/core';
import useStyles from '../utils/styles';

interface LayoutProps {
  title?: string;
  description?: string;
  children?: any;
}

function Layout(props: LayoutProps) {
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
      type: 'light',
      primary: {
        main: '#f0c000'
      },
      secondary: {
        main: '#208080'
      }
    }
  });
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{props.title ? `${props.title} - Next Amazona` : 'Next Amazona'}</title>
        {props.description && <meta name={'description'} content={props.description}></meta>}
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
              <NextLink href={'/cart'} passHref>
                <Link>Cart</Link>
              </NextLink>
              <NextLink href={'/login'} passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>
          {props.children}
        </Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Amazona</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;