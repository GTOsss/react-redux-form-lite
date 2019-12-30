import React, {useState} from 'react';
import Step1 from './step-1';
import getStep2 from './step-2';

let Step2;

const WizardFieldLevelValidation = ({onSubmit}) => {
  const [page, setPage] = useState(1);

  const nextPage = ({state: formState}: IReduxFormSubmitEvent<any>) => {
    if (!formState.form.hasErrors && !formState.form.hasWarnings) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const formsMap = {
    1: <Step1 onSubmit={nextPage} />,
    2: <Step2 onSubmit={onSubmit} prevPage={prevPage} />,
  };

  return (
    <div>
      {formsMap[page]}
    </div>
  );
};

export default () => {
  Step2 = getStep2();

  return WizardFieldLevelValidation;
};
