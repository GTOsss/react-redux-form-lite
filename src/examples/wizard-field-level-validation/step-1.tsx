import React from 'react';
import {Field, reduxForm} from '../../index';

const validationIsRequired = (value) => !value ? 'Field required.' : undefined;
const validationMinLength = (value) =>
  value && (value.length < 2) ? 'The minimum length of the value must be 2.' : undefined;

const Step1Component = (props) => {
  const {handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field validate={validationIsRequired} name="firstName" component="input" type="text" placeholder="First Name" />
      <Field
        warn={validationMinLength}
        validate={validationIsRequired}
        name="lastName"
        component="input"
        type="text"
        placeholder="Last Name"
      />
      <button type="button">Previous</button>
      <button type="submit">Next</button>
    </form>
  );
};

const Step1 = reduxForm({
  form: 'step1',
  wizard: 'wizardExample',
  destroyOnUnmount: false,
})(Step1Component);

export default Step1;
