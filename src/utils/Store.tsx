import {createContext, useReducer} from 'react';
import {NextPage} from 'next';
import Cookies from 'js-cookie';

interface StateProps {
  darkMode: boolean;
}

interface ActionProps {
  type: string;
}

const initialState: StateProps = {
  darkMode: Cookies.get('darkMode') === 'ON'
};

interface ContextProps {
  state: StateProps,
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
    default:
      return state;
  }
};

export const StoreProvider: NextPage = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{children}</Store.Provider>;
};