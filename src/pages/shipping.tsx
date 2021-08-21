import { Controller, useForm } from 'react-hook-form';
import React, { useContext, useEffect } from 'react';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';

import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { IFormShippingValues } from '../interfaces/IFormShippingValues';

import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';

const Shipping = () => {
  const router: any = useRouter();
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<IFormShippingValues>();

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const { fullName, address, city, country, postalCode }: IFormShippingValues =
    shippingAddress;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    setValue('fullName', fullName);
    setValue('address', address);
    setValue('city', city);
    setValue('postalCode', postalCode);
    setValue('country', country);
  }, [
    router,
    setValue,
    userInfo,
    address,
    city,
    country,
    fullName,
    postalCode,
  ]);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: IFormShippingValues) => {
    const data: IFormShippingValues = {
      fullName,
      address,
      city,
      postalCode,
      country,
    };

    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: data,
    });

    Cookies.set('shippingAddress', JSON.stringify(data));
    router.push('/payment');
  };

  return (
    <Layout title={'Endereço para envio'}>
      <CheckoutWizard activeStep={1} />
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component={'h1'} variant={'h1'}>
          Endereço para envio
        </Typography>
        <List>
          <ListItem>
            <Controller
              name={'fullName'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'fullName'}
                  label={'Nome Completo'}
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'O Nome deve conter 6 o mais caracteres!'
                        : 'Nome é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name={'address'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'address'}
                  label={'Endereço'}
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'O Endereço deve conter 6 o mais caracteres!'
                        : 'Endereço é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name={'city'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'city'}
                  label={'Cidade'}
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'Cidade deve conter 6 o mais caracteres!'
                        : 'Cidade é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name={'postalCode'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'postalCode'}
                  label={'CEP'}
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'O CEP deve conter 9 o mais caracteres!'
                        : 'CEP é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Controller
              name={'country'}
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant={'outlined'}
                  fullWidth
                  id={'country'}
                  label={'Estado'}
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'O Estado deve conter 6 o mais caracteres!'
                        : 'Estado é obrigatório!'
                      : ''
                  }
                  {...field}
                />
              )}
            />
          </ListItem>

          <ListItem>
            <Button
              variant={'contained'}
              type={'submit'}
              fullWidth
              color={'primary'}
            >
              Continuar
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};
export default Shipping;
// export default dynamic(() => Promise.resolve(Login), {ssr: false});