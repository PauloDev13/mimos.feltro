import { createContext, useReducer } from 'react';
import { NextPage } from 'next';
import Cookies from 'js-cookie';

import { IProduct } from '../interfaces/IProduct';

interface StateProps {
  darkMode: boolean;
  userInfo?: any;
  cart: {
    cartItems: IProduct[];
  };
}

interface ActionProps {
  type: string;
  payload?: any;
}

const initialState: StateProps = {
  darkMode: Cookies.get('darkMode') === 'ON',
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems') as string)
      : [],
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.stringify(Cookies.get('userInfo') as string)
    : null,
};

interface ContextProps {
  state: StateProps;
  dispatch: (type: ActionProps) => void;
}

export const Store = createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
});

const reducer = (state: StateProps, action: ActionProps): StateProps => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;

      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id,
      );

      const cartItems: IProduct[] = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item,
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id,
      );

      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'USER_LOGIN': {
      return { ...state, userInfo: action.payload };
    }
    case 'USER_LOGOUT': {
      return { ...state, userInfo: null, cart: { cartItems: [] } };
    }
    default:
      return state;
  }
};

export const StoreProvider: NextPage = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};