import Head from 'next/head';
import {AppBar, Container, Toolbar, Typography} from '@material-ui/core';
import useStyles from '../../utils/styles';

interface LayoutProps {
  children?: any;
}

function Layout(props: LayoutProps) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>Next Amazonas</title>
      </Head>
      <AppBar className={classes.navbar} position={'static'}>
        <Toolbar>
          <Typography>amazonas</Typography>
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