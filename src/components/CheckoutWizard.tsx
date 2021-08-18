import { Step, StepLabel, Stepper } from '@material-ui/core';

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {['Login', 'Endereço Entrega', 'Método Pagamento', 'Encomenda'].map(
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