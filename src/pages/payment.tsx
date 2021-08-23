import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';

import useStyles from '../utils/styles';
import { Store } from '../utils/Store';

import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import action from '../components/ActionSnackbar';

const Payment = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const router: any = useRouter();

  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  const [paymentMethod, setPaymentMethod] = useState('');

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Escolha uma forma de pagamento!', {
        variant: 'error',
        action,
      });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, [router, shippingAddress.address]);

  return (
    <Layout title={'Forma de pagamento'}>
      <CheckoutWizard activeStep={2} />

      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component={'h1'} variant={'h1'}>
          Forma de pagamento
        </Typography>
        <List>
          <ListItem>
            <FormControl component={'fieldset'}>
              <RadioGroup
                onChange={(e) => setPaymentMethod(e.target.value)}
                aria-label={'Forma de pagamento'}
                name={'paymentMethod'}
                value={paymentMethod}
              >
                <FormControlLabel
                  label={'PayPal'}
                  value={'PayPal'}
                  control={<Radio />}
                />
                <FormControlLabel
                  label={'Parcelado'}
                  value={'Parcelado'}
                  control={<Radio />}
                />
                <FormControlLabel
                  label={'Dinheiro'}
                  value={'Em dinheiro'}
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type={'submit'}
              variant={'contained'}
              color={'primary'}
            >
              Continuar
            </Button>
          </ListItem>
          <ListItem>
            <Button
              onClick={() => router.push('/shipping')}
              fullWidth
              type={'button'}
              variant={'contained'}
            >
              Voltar
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Payment;