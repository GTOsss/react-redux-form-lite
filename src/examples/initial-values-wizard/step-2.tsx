import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;

const Step2Component = (props) => {
  const {handleSubmit, prevPage} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field validate={validationIsRequired} name="phone" component="input" type="text" placeholder="Phone" />
      <Field
        warn={validationMinLength}
        validate={validationIsRequired}
        name="email"
        component="input"
        type="text"
        placeholder="Email"
      />
      <button type="button" onClick={prevPage}>Previous</button>
      <button type="submit">Next</button>
    </form>
  );
};

const Step2 = reduxForm({
  form: 'step2',
  wizard: 'wizardExample',
  destroyOnUnmount: false,
  initialValues: {
    phone: '+78889996655',
    email: 'test@mail.ru',
  },
})(Step2Component);

export default Step2;
