import Head from 'next/head';
import {AppBar, Container, Toolbar, Typography} from '@material-ui/core';

interface LayoutProps {
  children?: any;
}

function Layout(props: LayoutProps) {
  return (
    <div>
      <Head>
        <title>Next Amazonas</title>
      </Head>
      <AppBar position={'static'}>
        <Toolbar>
          <Typography>amazonas</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        {props.children}
      </Container>
    </div>
  );
};

export default Layout;