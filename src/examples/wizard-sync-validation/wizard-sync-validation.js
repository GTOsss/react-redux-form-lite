import React, {useState} from 'react';
import Form1 from './form-1';
import Form2 from './form-2';
import Form3 from './form-3';

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
    1: <Form1 onSubmit={nextPage} />,
    2: <Form2 onSubmit={nextPage} prevPage={prevPage} />,
    3: <Form3 onSubmit={onSubmit} prevPage={prevPage} />,
  };

  return (
    <div>
      {formsMap[page]}
    </div>
  );
};

export default WizardSyncValidation;
