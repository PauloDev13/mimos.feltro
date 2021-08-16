import Layout from '../components/Layout';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';

import useStyles from '../utils/styles';

const Login = () => {
  const classes = useStyles();
  return (
    <Layout title={'Login'}>
      <form className={classes.form}>
        <Typography component={'h1'} variant={'h1'}>
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'email'}
              label={'Email'}
              inputProps={{ type: 'email' }}
            />
          </ListItem>
          <ListItem>
            <TextField
              variant={'outlined'}
              fullWidth
              id={'password'}
              label={'Password'}
              inputProps={{ type: 'password' }}
            />
          </ListItem>
          <ListItem>
            <Button
              variant={'contained'}
              type={'submit'}
              fullWidth
              color={'primary'}
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            Ainda não é cadastrado? &nbsp;
            <NextLink href={'/register'} passHref>
              <Link>Faça seu cadastro aqui</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
//export default Login;
export default dynamic(() => Promise.resolve(Login), { ssr: false });