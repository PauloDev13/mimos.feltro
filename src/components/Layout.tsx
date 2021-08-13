import Head from 'next/head';
import NextLink from 'next/link';

import {AppBar, Container, Link, Toolbar, Typography} from '@material-ui/core';
import useStyles from '../utils/styles';

interface LayoutProps {
  title?: string;
  description?: string;
  children?: any;
}

function Layout(props: LayoutProps) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{props.title ? `${props.title} - Next Amazona` : 'Next Amazona'}</title>
        {props.description && <meta name={'description'} content={props.description}></meta>}
      </Head>
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
    </div>
  );
};

export default Layout;