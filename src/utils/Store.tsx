import {createContext, useReducer} from 'react';
import {NextPage} from 'next';
import Cookies from 'js-cookie';
import {IProduct} from '../interfaces/IProduct';

interface StateProps {
  darkMode: boolean;
  cart: {
    cartItems: IProduct[]
  };
}

interface ActionProps {
  type: string;
  payload?: any;
}

const cookie = Cookies.get('cartItems');

const initialState: StateProps = {
  darkMode: Cookies.get('darkMode') === 'ON',
  cart: {
    cartItems: cookie && cookie ? JSON.parse(cookie) : []
  }
};

interface ContextProps {
  state: StateProps,
  // eslint-disable-next-line no-unused-vars
  dispatch: (type: ActionProps) => void
}

export const Store = createContext<ContextProps>({
  state: initialState,
  dispatch: function () {
  },
});

const reducer = (state: StateProps, action: ActionProps) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return {...state, darkMode: true};
    case 'DARK_MODE_OFF':
      return {...state, darkMode: false};
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;

      const existItem = state.cart.cartItems.find(
        item => item._id === newItem._id
      );

      const cartItems: IProduct[] = existItem ? state.cart.cartItems.map(
        item => item.name === existItem.name ? newItem : item
      ) : [...state.cart.cartItems, newItem];

      Cookies.set('cartItems', JSON.stringify(cartItems));

      return {...state, cart: {...state.cart, cartItems}};
    }
    default:
      return state;
  }
};

export const StoreProvider: NextPage = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{children}</Store.Provider>;
};