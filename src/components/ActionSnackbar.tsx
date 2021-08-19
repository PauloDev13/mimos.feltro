import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const ActionSnackbar = (key: any) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <Button
      onClick={() => {
        closeSnackbar(key);
      }}
    >
      Sair
    </Button>
  );
};
export default ActionSnackbar;