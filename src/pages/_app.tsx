import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SnackbarProvider } from 'notistack';

import { StoreProvider } from '../utils/Store';
import Grow from '@material-ui/core/Grow';

const initialOptions = {
  'client-id': process.env.PAYPAL_CLIENT_ID || 'sb',
  currency: 'BRL',
};

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <SnackbarProvider
      // @ts-ignore
      TransitionComponent={Grow}
      autoHideDuration={3000}
      preventDuplicate
      dense={false}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <StoreProvider>
        <PayPalScriptProvider options={initialOptions} deferLoading={true}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
