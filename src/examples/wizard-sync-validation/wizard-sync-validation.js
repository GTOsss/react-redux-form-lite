import React, {useState} from 'react';
import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';

const WizardSyncValidation = ({onSubmit}) => {
  const [page, setPage] = useState(1);

  const nextPage = (values, formState) => {
    if (!formState.form.hasErrors && !formState.form.hasWarnings) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const formsMap = {
    1: <Step1 onSubmit={nextPage} />,
    2: <Step2 onSubmit={nextPage} prevPage={prevPage} />,
    3: <Step3 onSubmit={onSubmit} prevPage={prevPage} />,
  };

  return (
    <div>
      {formsMap[page]}
    </div>
  );
};

export default WizardSyncValidation;
