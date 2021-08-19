import { Step, StepLabel, Stepper } from '@material-ui/core';
import useStyles from '../utils/styles';

const CheckoutWizard = ({ activeStep = 0 }) => {
  const classes = useStyles();

  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {['Login', 'Endereço Entrega', 'Forma Pagamento', 'Finalizar Compra'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ),
      )}
    </Stepper>
  );
};
export default CheckoutWizard;